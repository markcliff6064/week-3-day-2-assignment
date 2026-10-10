# Week 3 Day 2 Assignment — Async JavaScript

This assignment practices asynchronous JavaScript using callbacks, Promises, async/await, parallel API requests, Promise methods, retry logic, and exponential backoff.
![shown](https://github.com/markcliff6064/week-3-day-2-assignment/blob/dd02c0cf50ceb5e067daaa2b065b70b56f17826e/1.jpg)
![shown](https://github.com/markcliff6064/week-3-day-2-assignment/blob/dd02c0cf50ceb5e067daaa2b065b70b56f17826e/2.jpg)
![shown](https://github.com/markcliff6064/week-3-day-2-assignment/blob/dd02c0cf50ceb5e067daaa2b065b70b56f17826e/3.jpg)
## Topics Practiced

* Callback functions
* Promises
* `async/await`
* `try/catch`
* `Promise.all()`
* `Promise.race()`
* `Promise.allSettled()`
* `fetch()`
* API requests
* Request timing
* Retry mechanisms
* Exponential backoff
* Concurrency limiting

## Project Structure

```text
week-3-day-2-assignment/
│
├── callbacks-to-async.js
├── race.js
├── retry.js
├── rate-limiter.js
└── README.md
```

## Task 1 — Callback → Promise → Async/Await

`callbacks-to-async.js` contains three simulated asynchronous operations:

* `readFile()`
* `getUser()`
* `saveToDb()`

Each operation is implemented using:

1. A callback
2. A Promise
3. Async/await

Both successful and failed operations are tested.

### Run

```bash
node callbacks-to-async.js
```

### Sample Output

```text
=== readFile ===
Callback: Contents of data.txt
Promise: Contents of data.txt
Async/Await: Contents of data.txt
Error handling: File not found

=== getUser ===
Callback: { id: 1, name: 'Amina', email: 'amina@example.com' }
Promise: { id: 1, name: 'Amina', email: 'amina@example.com' }
Async/Await: { id: 1, name: 'Amina', email: 'amina@example.com' }
Error handling: Invalid user ID

=== saveToDb ===
Callback: { name: 'Amina', email: 'amina@example.com', id: 527, saved: true }
Promise: { name: 'Amina', email: 'amina@example.com', id: 814, saved: true }
Async/Await: { name: 'Amina', email: 'amina@example.com', id: 362, saved: true }
Error handling: Name is required
```

The generated database IDs will be different on each run.

---

## Task 2 — API Race

`race.js` fetches data from three JSONPlaceholder APIs:

* Posts
* Users
* Todos

It demonstrates:

* `Promise.all()`
* `Promise.race()`
* `Promise.allSettled()`
* Individual API timing
* Total request timing

### Run

```bash
node race.js
```

### Sample Output

```text
=== Promise.all Results ===
Post: { ... }
User: { ... }
Todo: { ... }
All completed in: 300ms

=== Promise.race Winner ===
Fastest API: todos (140ms)

=== Promise.allSettled Results ===
posts: fulfilled
users: fulfilled
todos: fulfilled

=== Individual Timings ===
posts: 150ms
users: 170ms
todos: 140ms
```

The exact timing will vary depending on network and server response time.

---

## Task 3 — Fetch With Retry

`retry.js` contains a `fetchWithRetry()` function.

The function retries failed requests using exponential backoff.

The waiting periods are:

```text
First retry  → 1 second
Second retry → 2 seconds
Third retry  → 4 seconds
```

The function also reports the number of attempts and total elapsed time when all attempts fail.

### Run

```bash
node retry.js
```

### Sample Output

```text
Fetching https://jsonplaceholder.typicode.com/posts/1...
Attempt 1 of 3...
Attempt 1 of 3: Success!

Fetching https://jsonplaceholder.typicode.com/nonexistent...
Attempt 1 of 3 failed. Retrying in 1000ms...
Attempt 2 of 3 failed. Retrying in 2000ms...
Attempt 3 of 3...
Error: Failed after 3 attempts: HTTP 404
```

---

## Bonus — Rate Limiter

`rate-limiter.js` implements a simple concurrency limiter.

It fetches multiple URLs while allowing only a specified number of requests to run concurrently.

The test uses:

```javascript
rateLimitedFetch(urls, 3);
```

This means a maximum of three workers operate at the same time.

### Run

```bash
node rate-limiter.js
```

### Sample Output

```text
Fetching 1 of 10
Fetching 2 of 10
Fetching 3 of 10

Completed: 1/10
Fetching 4 of 10

Completed: 2/10
Fetching 5 of 10

Completed: 3/10
Fetching 6 of 10

...

Completed: 10/10
```

## Requirements

Node.js 18 or newer is recommended because the project uses the built-in `fetch()` API.

## What I Learned

This assignment helped me understand how JavaScript handles operations that take time to complete.

I practiced converting callback-based code into Promises, using async/await for cleaner asynchronous code, running multiple API requests in parallel, identifying the fastest request, handling partial failures, and retrying failed requests using exponential backoff.

## Running the Project

Clone the repository and enter the project directory:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd week-3-day-2-assignment
```

Run each required task:

```bash
node callbacks-to-async.js
node race.js
node retry.js
```

Run the bonus:

```bash
node rate-limiter.js
```
