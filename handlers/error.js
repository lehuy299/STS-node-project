
const databaseConnectionFailed = (err) => {
    console.log("database connection failed. exiting now...");
	console.error(err);
	process.exit(1);
}

module.exports =
{
    databaseConnectionFailed
}