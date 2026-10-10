// WEEK 3 - DAY 2
// TASK 2: API RACE

// The three APIs we are going to request.
const urls = {
    posts: "https://jsonplaceholder.typicode.com/posts/1",
    users: "https://jsonplaceholder.typicode.com/users/1",
    todos: "https://jsonplaceholder.typicode.com/todos/1"
};


// FETCH FUNCTION WITH TIMING

// This function fetches one API and records how long
// the request takes.
//
// We return an object containing:
// - the API name
// - the data
// - the time taken
async function fetchWithTiming(name, url) {

    // Record the time before starting the request.
    const startTime = Date.now();

    try {

        // fetch() sends the HTTP request.
        const response = await fetch(url);

        // response.ok is false for HTTP errors such as 404.
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        // Convert the response body from JSON text
        // into a JavaScript object.
        const data = await response.json();

        // Record the time after the request finishes.
        const endTime = Date.now();

        // Calculate how many milliseconds it took.
        const duration = endTime - startTime;

        console.log(`${name} completed in ${duration}ms`);

        return {
            name,
            data,
            duration
        };

    } catch (error) {

        // If the request fails, we throw the error
        // so Promise.allSettled() can detect the failure.
        throw new Error(`${name}: ${error.message}`);
    }
}



// MAIN PROGRAM


async function runApiTests() {

    console.log("==========================================");
    console.log("TASK 2: API RACE");
    console.log("==========================================");


 
    // PROMISE.ALL()


    console.log("\n=== Promise.all Results ===");

    // Start measuring before all three requests begin.
    const allStartTime = Date.now();

    try {

        // IMPORTANT:
        // All three fetch operations are started together.
        //
        // Promise.all() waits until ALL three are finished.
        const [post, user, todo] = await Promise.all([

            fetchWithTiming("posts", urls.posts),

            fetchWithTiming("users", urls.users),

            fetchWithTiming("todos", urls.todos)
        ]);


        // Measure the total time.
        const allEndTime = Date.now();

        console.log("\nPost:", post.data);
        console.log("User:", user.data);
        console.log("Todo:", todo.data);

        console.log(
            `All completed in: ${allEndTime - allStartTime}ms`
        );

    } catch (error) {

        console.log("Promise.all Error:", error.message);
    }



    // PROMISE.RACE()

    console.log("\n=== Promise.race Winner ===");

    try {

        // Promise.race() returns whichever Promise
        // finishes first.
        const winner = await Promise.race([

            fetchWithTiming("posts", urls.posts),

            fetchWithTiming("users", urls.users),

            fetchWithTiming("todos", urls.todos)
        ]);

        console.log(
            `Fastest API: ${winner.name} (${winner.duration}ms)`
        );

    } catch (error) {

        console.log("Promise.race Error:", error.message);
    }



    // PROMISE.ALLSETTLED()

    console.log("\n=== Promise.allSettled Results ===");

    // allSettled() waits for EVERY Promise.
    //
    // Unlike Promise.all(), one failed request does
    // NOT stop the other results from being returned.
    const results = await Promise.allSettled([

        fetchWithTiming("posts", urls.posts),

        fetchWithTiming("users", urls.users),

        fetchWithTiming("todos", urls.todos)
    ]);


    // Loop through every result.
    results.forEach((result, index) => {

        const names = ["posts", "users", "todos"];

        if (result.status === "fulfilled") {

            console.log(
                `${names[index]}: fulfilled`
            );

            console.log(
                `Time: ${result.value.duration}ms`
            );
        }

        else {

            console.log(
                `${names[index]}: rejected`
            );

            console.log(
                `Error: ${result.reason.message}`
            );
        }
    });

    // INDIVIDUAL TIMINGS

    console.log("\n=== Individual Timings ===");

    // Fetch all three again so we can display
    // their individual timing information clearly.
    const timingResults = await Promise.all([

        fetchWithTiming("posts", urls.posts),

        fetchWithTiming("users", urls.users),

        fetchWithTiming("todos", urls.todos)
    ]);


    timingResults.forEach(result => {

        console.log(
            `${result.name}: ${result.duration}ms`
        );
    });
}


// Start the program.
runApiTests();