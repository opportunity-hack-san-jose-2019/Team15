const express = require('express');

const app = express();

app.get('/', (req, res) => res.send('OPPORTUNITY HACK API RUNNING'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`SERVER STARTED ON PORT ${PORT}`));
