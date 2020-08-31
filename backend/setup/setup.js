/* Copyright 2020 abreums

Permission to use, copy, modify, and/or distribute this software for any purpose 
with or without fee is hereby granted, provided that the above copyright notice 
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH 
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND 
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, 
OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, 
DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, 
ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

'use strict'

// Este script cria a tabela no banco DynamoDB
// O primeio parâmetro será a região AWS onde o banco será criado.
// ex. node ./setup.js sa-east-1

const AWS = require('aws-sdk')
// only for local configuration
AWS.config.update({
  region: "local",
  endpoint: "http://localhost:8000"
});
// uncomment this to PRD
// AWS.config.update({region: process.argv[2]})

const ddb = new AWS.DynamoDB() 
const ddbGeo = require('dynamodb-geo')

// Parâmetros da tabela DynamoDB
const DDB_TABLENAME = 'corongaTracker'
const config = new ddbGeo.GeoDataManagerConfiguration(ddb, DDB_TABLENAME)
config.hashKeyLength = 5

// Use GeoTableUtil para ajudar a definir a tabela com parâmetros geográficos:
const createTableInput = ddbGeo.GeoTableUtil.getCreateTableRequest(config)

// Parâmetros da tabela DynamoDB
delete createTableInput.ProvisionedThroughput
createTableInput.BillingMode = 'PAY_PER_REQUEST'
createTableInput.StreamSpecification = {
  StreamEnabled: true,
  StreamViewType: 'NEW_AND_OLD_IMAGES'
}

console.log('Criando tabela corongaTracker:')
console.dir(createTableInput, { depth: null })

// Criar tabela
ddb.createTable(createTableInput).promise()
  // Aguarde o processo executar até o final
  .then(function () { return ddb.waitFor('tableExists', { TableName: config.tableName }).promise() })
  .then(function () { console.log('Tabela corongaTracker criada!') })



