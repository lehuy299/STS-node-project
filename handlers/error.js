// const registerDuplicate = (error, res) => {
//     if (error.code === 11000) {
//         // duplicate key
//         return res.json({ status: 'error', error: 'Username already in use' })
//     }
//     throw error
// }

const databaseConnectionFailed = (err) => {
    console.log("database connection failed. exiting now...");
	console.error(err);
	process.exit(1);
}

module.exports =
{
    //registerDuplicate,
    databaseConnectionFailed
}