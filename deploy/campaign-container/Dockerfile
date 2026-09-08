# Build once, then configure campaigns with the resulting immutable local image ID.
ARG NODE_IMAGE=node@sha256:66bb8d36ae1ddd72199ed235a089904874ca4079ee517936ca3adb80506a75c1
ARG BUN_IMAGE=oven/bun@sha256:5ff609364c049b54eb0ff560ec96319729a972078ef2c755d758f0c6ef89c2d6
FROM ${BUN_IMAGE} AS bun
FROM ${NODE_IMAGE}
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
RUN npm install --global --ignore-scripts @openai/codex@0.153.4 && codex --version && git --version
COPY campaign-init.c /tmp/campaign-init.c
RUN cc -O2 -Wall -Wextra -Werror -o /usr/local/bin/repo-harness-campaign-init /tmp/campaign-init.c && rm /tmp/campaign-init.c
ENTRYPOINT ["/usr/local/bin/repo-harness-campaign-init"]
