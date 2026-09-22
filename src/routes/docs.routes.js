const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');

const router = express.Router();

const swaggerDocument = yaml.load(
  fs.readFileSync(path.join(__dirname, '../../swagger.yaml'), 'utf8')
);

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;
