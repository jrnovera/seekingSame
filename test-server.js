const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Test server is running!');
});

const port = 4242;
app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}`);
});
