#define _GNU_SOURCE
#include <errno.h>
#include <grp.h>
#include <limits.h>
#include <linux/capability.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/prctl.h>
#include <sys/stat.h>
#include <sys/syscall.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <time.h>
#include <unistd.h>

/* This is the namespace init, not a process-group supervisor. Its exit causes
 * the kernel to kill every descendant, including detached/setsid processes. */
static volatile sig_atomic_t cancelled;
static void cancel(int signal) { (void)signal; cancelled = 1; }
static long long millis(clockid_t clock) {
  struct timespec t;
  if (clock_gettime(clock, &t)) _exit(125);
  return (long long)t.tv_sec * 1000 + t.tv_nsec / 1000000;
}
static long long number(const char *value) {
  char *end; errno = 0;
  long long n = strtoll(value, &end, 10);
  if (errno || !*value || *end || n <= 0) _exit(125);
  return n;
}
static void drop_workload_privileges(uid_t uid, gid_t gid) {
  if (setgroups(0, NULL) || setresgid(gid, gid, gid) || setresuid(uid, uid, uid)) _exit(125);
  struct __user_cap_header_struct header = { _LINUX_CAPABILITY_VERSION_3, 0 };
  struct __user_cap_data_struct caps[2] = {{0}, {0}};
  if (syscall(SYS_capset, &header, caps) || prctl(PR_CAP_AMBIENT, PR_CAP_AMBIENT_CLEAR_ALL, 0, 0, 0)
    || prctl(PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0)) _exit(125);
  uid_t ruid, euid, suid; gid_t rgid, egid, sgid;
  if (getresuid(&ruid, &euid, &suid) || getresgid(&rgid, &egid, &sgid)
    || ruid != uid || euid != uid || suid != uid || rgid != gid || egid != gid || sgid != gid
    || getgroups(0, NULL) != 0 || syscall(SYS_capget, &header, caps)
    || caps[0].effective || caps[0].permitted || caps[0].inheritable
    || caps[1].effective || caps[1].permitted || caps[1].inheritable
    || prctl(PR_GET_NO_NEW_PRIVS, 0, 0, 0, 0) != 1) _exit(125);
}
int main(int argc, char **argv) {
  if (argc < 6 || getpid() != 1 || getuid() != 0) return 125;
  long long deadline = number(argv[1]), uid = number(argv[2]), gid = number(argv[3]);
  if (uid >= UINT_MAX || gid >= UINT_MAX || (strcmp(argv[4], "auth") && strcmp(argv[4], "no-auth"))) return 125;
  long long remaining = deadline - millis(CLOCK_REALTIME);
  if (remaining <= 0) return 124;
  long long stop = millis(CLOCK_MONOTONIC) + remaining;
  if (mkdir("/home/campaign/.codex", 0777) || chmod("/home/campaign/.codex", 0777)) return 125;
  if (!strcmp(argv[4], "auth") && symlink("/run/codex-auth.json", "/home/campaign/.codex/auth.json")) return 125;
  struct sigaction action = {0}; action.sa_handler = cancel;
  sigaction(SIGTERM, &action, NULL); sigaction(SIGINT, &action, NULL); sigaction(SIGHUP, &action, NULL);
  if (millis(CLOCK_REALTIME) >= deadline) return 124;
  pid_t child = fork();
  if (child < 0) return 125;
  if (!child) {
    drop_workload_privileges((uid_t)uid, (gid_t)gid);
    clearenv();
    setenv("PATH", "/usr/local/bin:/usr/bin:/bin", 1);
    setenv("HOME", "/home/campaign", 1); setenv("CODEX_HOME", "/home/campaign/.codex", 1);
    setenv("GIT_OPTIONAL_LOCKS", "0", 1);
    if (millis(CLOCK_REALTIME) >= deadline || millis(CLOCK_MONOTONIC) >= stop) _exit(124);
    if (argv[5][0] != '/') _exit(125);
    execv(argv[5], argv + 5); _exit(125);
  }
  for (;;) {
    if (cancelled) return 143;
    if (millis(CLOCK_MONOTONIC) >= stop || millis(CLOCK_REALTIME) >= deadline) return 124;
    int status; pid_t ended = waitpid(child, &status, WNOHANG);
    if (ended == child) return WIFEXITED(status) ? WEXITSTATUS(status) : 137;
    if (ended < 0 && errno != EINTR) return 125;
    struct timespec pause = {0, 10000000}; nanosleep(&pause, NULL);
  }
}
