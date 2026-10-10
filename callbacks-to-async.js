// WEEK 3 - DAY 2
// TASK 1: CALLBACK → PROMISE → ASYNC/AWAIT


// 1. ORIGINAL CALLBACK-BASED FUNCTIONS

// Simulates reading a file.
//
// A callback function is passed into readFile.
// The callback receives:
//   - an error if something goes wrong
//   - the data if the operation succeeds
function readFile(filename, callback) {

    // setTimeout simulates a slow operation such as
    // reading a real file from a computer.
    setTimeout(() => {

        // If the requested file does not exist,
        // send an error to the callback.
        if (filename === "missing.txt") {
            callback(new Error("File not found"), null);
        }

        // Otherwise, send the file contents.
        else {
            callback(null, `Contents of ${filename}`);
        }

    }, 500);
}


// Simulates fetching a user from a server/database.
function getUser(userId, callback) {

    // Simulate a network/database delay.
    setTimeout(() => {

        // User IDs must be greater than 0.
        if (userId <= 0) {
            callback(new Error("Invalid user ID"), null);
        }

        // Successful user request.
        else {
            callback(
                null,
                {
                    id: userId,
                    name: "Amina",
                    email: "amina@example.com"
                }
            );
        }

    }, 300);
}


// Simulates saving data into a database.
function saveToDb(data, callback) {

    // Simulate database processing time.
    setTimeout(() => {

        // The database requires a name.
        if (!data.name) {
            callback(new Error("Name is required"), null);
        }

        // Successful database save.
        else {
            callback(
                null,
                {
                    ...data,

                    // Generate a random ID for the saved record.
                    id: Math.floor(Math.random() * 1000),

                    saved: true
                }
            );
        }

    }, 400);
}



// 2. PROMISE VERSIONS
// 
// A Promise represents an operation that will finish
// either successfully or unsuccessfully in the future.

// --------------------------------------------------
// readFile Promise version
// --------------------------------------------------

function readFilePromise(filename) {

    // return new Promise allows the function to be
    // used with .then() and .catch().
    return new Promise((resolve, reject) => {

        // We still use the original callback function.
        readFile(filename, (error, data) => {

            // reject() means the Promise failed.
            if (error) {
                reject(error);
            }

            // resolve() means the Promise succeeded.
            else {
                resolve(data);
            }
        });
    });
}


// --------------------------------------------------
// getUser Promise version
// --------------------------------------------------

function getUserPromise(userId) {

    return new Promise((resolve, reject) => {

        getUser(userId, (error, user) => {

            if (error) {
                reject(error);
            }
            else {
                resolve(user);
            }
        });
    });
}


// --------------------------------------------------
// saveToDb Promise version
// --------------------------------------------------

function saveToDbPromise(data) {

    return new Promise((resolve, reject) => {

        saveToDb(data, (error, savedData) => {

            if (error) {
                reject(error);
            }
            else {
                resolve(savedData);
            }
        });
    });
}



// 3. ASYNC/AWAIT VERSIONS

// async allows a function to use await.
//
// await pauses this function until the Promise
// finishes. It does NOT block the entire Node.js program.

// --------------------------------------------------
// readFile Async/Await
// --------------------------------------------------

async function readFileAsync(filename) {

    try {

        // Wait for the Promise version to finish.
        const data = await readFilePromise(filename);

        return data;

    } catch (error) {

        // Pass the error to the caller.
        throw error;
    }
}


// --------------------------------------------------
// getUser Async/Await
// --------------------------------------------------

async function getUserAsync(userId) {

    try {

        const user = await getUserPromise(userId);

        return user;

    } catch (error) {

        throw error;
    }
}


// --------------------------------------------------
// saveToDb Async/Await
// --------------------------------------------------

async function saveToDbAsync(data) {

    try {

        const savedData = await saveToDbPromise(data);

        return savedData;

    } catch (error) {

        throw error;
    }
}


// 4. TESTING THE FUNCTIONS

// We use async here because our tests contain await.
async function runTests() {

    console.log("==========================================");
    console.log("TASK 1: CALLBACK → PROMISE → ASYNC/AWAIT");
    console.log("==========================================");



    // READ FILE

    console.log("\n=== readFile ===");

    // ---------- CALLBACK SUCCESS ----------
    readFile("data.txt", (error, data) => {

        if (error) {
            console.log("Callback Error:", error.message);
        }
        else {
            console.log("Callback:", data);
        }
    });


    // Wait a little so the callback example finishes
    // before moving to the Promise example.
    await new Promise(resolve => setTimeout(resolve, 600));


    // ---------- PROMISE SUCCESS ----------
    try {

        const data = await readFilePromise("data.txt");

        console.log("Promise:", data);

    } catch (error) {

        console.log("Promise Error:", error.message);
    }


    // ---------- ASYNC/AWAIT SUCCESS ----------
    try {

        const data = await readFileAsync("data.txt");

        console.log("Async/Await:", data);

    } catch (error) {

        console.log("Async/Await Error:", error.message);
    }


    // ---------- ERROR TEST ----------
    try {

        await readFilePromise("missing.txt");

    } catch (error) {

        console.log("Error handling:", error.message);
    }


    // GET USER
    //

    console.log("\n=== getUser ===");

    // ---------- CALLBACK SUCCESS ----------
    getUser(1, (error, user) => {

        if (error) {
            console.log("Callback Error:", error.message);
        }
        else {
            console.log("Callback:", user);
        }
    });


    await new Promise(resolve => setTimeout(resolve, 400));


    // ---------- PROMISE SUCCESS ----------
    try {

        const user = await getUserPromise(1);

        console.log("Promise:", user);

    } catch (error) {

        console.log("Promise Error:", error.message);
    }


    // ---------- ASYNC/AWAIT SUCCESS ----------
    try {

        const user = await getUserAsync(1);

        console.log("Async/Await:", user);

    } catch (error) {

        console.log("Async/Await Error:", error.message);
    }


    // ---------- ERROR TEST ----------
    try {

        await getUserPromise(0);

    } catch (error) {

        console.log("Error handling:", error.message);
    }



    // SAVE TO DATABASE


    console.log("\n=== saveToDb ===");

    // ---------- CALLBACK SUCCESS ----------
    saveToDb(
        {
            name: "Amina",
            email: "amina@example.com"
        },
        (error, data) => {

            if (error) {
                console.log("Callback Error:", error.message);
            }
            else {
                console.log("Callback:", data);
            }
        }
    );


    await new Promise(resolve => setTimeout(resolve, 500));


    // ---------- PROMISE SUCCESS ----------
    try {

        const savedData = await saveToDbPromise({
            name: "Amina",
            email: "amina@example.com"
        });

        console.log("Promise:", savedData);

    } catch (error) {

        console.log("Promise Error:", error.message);
    }


    // ---------- ASYNC/AWAIT SUCCESS ----------
    try {

        const savedData = await saveToDbAsync({
            name: "Amina",
            email: "amina@example.com"
        });

        console.log("Async/Await:", savedData);

    } catch (error) {

        console.log("Async/Await Error:", error.message);
    }


    // ---------- ERROR TEST ----------
    try {

        await saveToDbPromise({
            email: "amina@example.com"
        });

    } catch (error) {

        console.log("Error handling:", error.message);
    }
}


// Start the tests.
runTests();