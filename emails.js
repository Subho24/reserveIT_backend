function accountRegistered(sendTo, pwd, restaurantName, ) {
    const email = {
        from: 'no-reply@reserveit.se',
        to: sendTo,
        subject: 'Account Created',
        text: '',
        html: `
            <body>
            <h3>Hey!</h3>
            <p>An account has been created for the restaurant ${restaurantName}.</p>
            <br/>
            <p>Use the one time password to <a href="http://reserveit.se/login">login</a> into your account.</p>
            <br/>
            <p>Password: ${pwd}</p>
            <br/>
            <br/>
            <p>Don't forget to <a href="#">change</a> the password later.</p>
            </div>
            </body>
        `
    };
    return email;
}

module.exports = { accountRegistered }