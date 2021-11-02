const registerDuplicate = (err) => {
    if (err.code === 11000) {
        // duplicate key
        return res.json({ status: 'error', error: 'Username already in use' })
    }
    throw err
}

const databaseConnectionFailed = (err) => {
    console.log("database connection failed. exiting now...");
	console.error(err);
	process.exit(1);
}

module.exports =
{
    registerDuplicate
}