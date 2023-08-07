function accountRegistered(sendTo, pwd, restaurantName, ) {
    const email = {
        from: 'noreply@reserveit.se',
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


function reservationConfirmed(sendTo, name, people, date, time) {

    const email = {
        from: 'noreply@reserveit.se',
        to: sendTo,
        subject: 'Reservation Confirmed',
        text: '',
        html: `
        <html>
        <body>
        <div style="
        font-family: sans-serif;
        text-align: center;
        width: 90%;
        margin: auto;
        background-color: aliceblue;
        ">
                <h1>Confirmation</h1>
                <p>Hello ${name}!</p>
                <p>Thank you very much for your reservation for ${people} people.<br/>We look forward to your visit on ${date} at ${time}.<br/>For changes, email sam@kaisekimalmo.se</p>
                <br/>
                <p>Kind regards<br/>Kaiseki - Malmö<br/>Address: Stora Nygatan 23<br/>211 37</p>
            </div>
        </body>
        </html>
        `,
    };
    return email;
}

module.exports = { accountRegistered, reservationConfirmed }