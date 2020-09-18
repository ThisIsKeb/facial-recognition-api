const handleSignIn = (db, bcrypt) => (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
	return res.status(400).json('incorrect form submission')
}
	db.select('email', 'hash')
	.from('login')
	.where('email', '=', email)
	.then(data => {
		const isValid = bcrypt.compareSync(password, data[0].hash)
		res.json(data[0])
		if (isValid){
	 return db.select('*')
			.from('users')
			.where('email', '=', email)
			.then(user => {
				res.json(user[0])
			})
			.catch(err => {
				//res.status(400).json('unable to get user');
			res.status(400).json(err);
			//console.log(err);
			//console.log('transaction error');
			})
		} else {
			//res.status(400).json('Wrong credintials, please try again');
			res.status(400).json(err);
			//console.log(err);
			//console.log('transaction error');
		}
	})
	.catch(err => res.status(400).json('Wrong credintials, please try again'))
}

module.exports = {
	handleSignIn: handleSignIn
}