// WEEK 3 - DAY 2
// TASK 3: FETCH WITH RETRY

// --------------------------------------------------
// Helper function: wait
// --------------------------------------------------

// JavaScript does not have a simple "sleep" command
// for async code.
//
// We can create one using a Promise and setTimeout.
//
// Example:
// await wait(1000);
//
// This pauses the current async function for 1 second.
function wait(milliseconds) {

    return new Promise(resolve => {

        setTimeout(resolve, milliseconds);

    });
}

// FETCH WITH RETRY


async function fetchWithRetry(url, maxRetries = 3) {

    // Record when the whole operation starts.
    const startTime = Date.now();


    // Try the request up to maxRetries times.
    for (let attempt = 1; attempt <= maxRetries; attempt++) {

        try {

            console.log(
                `Attempt ${attempt} of ${maxRetries}...`
            );


            // Send the request.
            const response = await fetch(url);


            // fetch() does NOT automatically throw an error
            // for HTTP errors such as 404.
            //
            // Therefore, we check response.ok ourselves.
            if (!response.ok) {

                throw new Error(`HTTP ${response.status}`);
            }


            // Convert the successful response into JSON.
            const data = await response.json();


            // Calculate the total time taken.
            const totalTime = Date.now() - startTime;


            console.log(
                `Attempt ${attempt} of ${maxRetries}: Success!`
            );

            console.log(
                `Total time: ${totalTime}ms`
            );


            // Return the data because the request succeeded.
            return data;


        } catch (error) {

            // Check whether this was the final attempt.
            if (attempt === maxRetries) {

                // Calculate total time before giving up.
                const totalTime = Date.now() - startTime;


                // Throw a new error containing useful information.
                throw new Error(
                    `Failed after ${maxRetries} attempts: ` +
                    `${error.message}. ` +
                    `Total time: ${totalTime}ms`
                );
            }


            // --------------------------------------------------
            // EXPONENTIAL BACKOFF
            // --------------------------------------------------

            // attempt = 1 → 1000ms
            // attempt = 2 → 2000ms
            // attempt = 3 → 4000ms
            //
            // Math.pow(2, attempt - 1) produces:
            //
            // 2^0 = 1
            // 2^1 = 2
            // 2^2 = 4
            //
            // Multiplying by 1000 converts seconds to milliseconds.
            const waitTime =
                Math.pow(2, attempt - 1) * 1000;


            console.log(
                `Attempt ${attempt} of ${maxRetries} failed. ` +
                `Retrying in ${waitTime}ms...`
            );


            // Wait before making the next attempt.
            await wait(waitTime);
        }
    }
}



// TESTING


async function runTests() {

    console.log("==========================================");
    console.log("TASK 3: FETCH WITH RETRY");
    console.log("==========================================");



    // TEST 1: VALID URL


    const validUrl =
        "https://jsonplaceholder.typicode.com/posts/1";

    console.log(`\nFetching ${validUrl}...`);


    try {

        // This should succeed on the first attempt.
        const data = await fetchWithRetry(validUrl);

        console.log("Data:", data);

    } catch (error) {

        console.log("Error:", error.message);
    }


    // TEST 2: INVALID URL


    const invalidUrl =
        "https://jsonplaceholder.typicode.com/nonexistent";

    console.log(`\nFetching ${invalidUrl}...`);


    try {

        // This URL returns 404.
        //
        // The function will retry:
        // Attempt 1
        // wait 1 second
        //
        // Attempt 2
        // wait 2 seconds
        //
        // Attempt 3
        // finally fail
        const data = await fetchWithRetry(invalidUrl);

        console.log("Data:", data);

    } catch (error) {

        console.log("Error:", error.message);
    }
}


// Start the tests.
runTests();


// BONUS: RATE LIMITED FETCH


// --------------------------------------------------
// Fetch one URL
// --------------------------------------------------

async function fetchUrl(url, index, total) {

    console.log(
        `Fetching ${index + 1} of ${total}: ${url}`
    );

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
}


// RATE LIMITED FETCH


async function rateLimitedFetch(urls, maxConcurrent = 3) {

    // This array will store the final results.
    //
    // Each result is placed at the same position
    // as its original URL.
    const results = new Array(urls.length);


    // Keeps track of which URL should be fetched next.
    let nextIndex = 0;


    // Counts how many requests have completed.
    let completed = 0;


    // --------------------------------------------------
    // Worker function
    // --------------------------------------------------

    // A worker repeatedly takes the next available URL.
    //
    // If maxConcurrent = 3, we create 3 workers.
    //
    // This means a maximum of 3 requests can run
    // at approximately the same time.
    async function worker() {

        while (true) {

            // Get the next URL index.
            const currentIndex = nextIndex++;

            // If there are no URLs left, stop this worker.
            if (currentIndex >= urls.length) {
                return;
            }


            try {

                // Fetch the URL.
                const data = await fetchUrl(
                    urls[currentIndex],
                    currentIndex,
                    urls.length
                );


                // Save the result at the original index.
                results[currentIndex] = data;


                // Increase completed counter.
                completed++;


                console.log(
                    `Completed: ${completed}/${urls.length}`
                );

            } catch (error) {

                // Store the error instead of stopping
                // all the other requests.
                results[currentIndex] = {
                    error: error.message
                };

                completed++;


                console.log(
                    `Completed: ${completed}/${urls.length}`
                );
            }
        }
    }


    // --------------------------------------------------
    // Create workers
    // --------------------------------------------------

    // We do not want more workers than URLs.
    const workerCount = Math.min(
        maxConcurrent,
        urls.length
    );


    // Create an array containing the workers.
    const workers = [];


    for (let i = 0; i < workerCount; i++) {

        workers.push(worker());
    }


    // Wait for all workers to finish.
    await Promise.all(workers);


    // Return the results in original URL order.
    return results;
}



// TEST


async function runBonus() {

    // Create 10 URLs.
    const urls = [];

    for (let i = 1; i <= 10; i++) {

        urls.push(
            `https://jsonplaceholder.typicode.com/posts/${i}`
        );
    }


    console.log("==========================================");
    console.log("BONUS: RATE LIMITED FETCH");
    console.log("==========================================");


    // Only 3 requests are allowed to run
    // concurrently.
    const results = await rateLimitedFetch(urls, 3);


    console.log("\n=== Final Results ===");

    results.forEach((result, index) => {

        console.log(
            `Post ${index + 1}:`,
            result
        );
    });
}


// Run the bonus.
runBonus();