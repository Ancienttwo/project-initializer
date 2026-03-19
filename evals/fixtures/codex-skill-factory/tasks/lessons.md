# Lessons Learned (Self-Improvement Loop)

> Capture correction-derived prevention rules here.
> Promote repeated patterns into durable project rules during spa day.

- Date: 2026-03-10
- Triggered by correction: User corrected test structure
- Mistake pattern: testing-conventions — wrote unit tests instead of integration tests for API endpoints
- Prevention rule: Always write integration tests for API endpoints; unit tests alone miss middleware behavior

- Date: 2026-03-12
- Triggered by correction: User corrected test structure again
- Mistake pattern: testing-conventions — mocked database in integration tests
- Prevention rule: Integration tests must hit a real database; mocks hide migration bugs

- Date: 2026-03-14
- Triggered by correction: User corrected test assertions
- Mistake pattern: testing-conventions — asserted on response status only, not body
- Prevention rule: Always assert on both response status and body shape in API tests
