const AWS = require("aws-sdk");

const searchProducts = async (event) => {
  try {
    const name = event.queryStringParameters?.name?.toLowerCase();
    console.log("event.query.search-------" + name);

    AWS.config.credentials = {
      accessKeyId: "AKIASVGLKLB6NH25UNHW",
      secretAccessKey: "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",
    };

    var dynamoDB = new AWS.DynamoDB();
    if (name != null) {
      var params = {
        TableName: "Items",
        ProjectionExpression:
          "ItemType, Image1, Image2, ItemName, ItemId, #usr, Ingreds",
        FilterExpression:
          "(contains (ItemName, :name) OR ItemType = :category) AND Visible = :visible",
        ExpressionAttributeNames: {
          "#usr": "User",
        },
        ExpressionAttributeValues: {
          ":name": { S: name },
          ":category": { S: name },
          ":visible": { BOOL: true },
        },
      };
    } else {
      var params = {
        TableName: "Items",
        FilterExpression: "Visible = :visible",
        ExpressionAttributeValues: {
          ":visible": { BOOL: true },
        },
      };
    }
    const result = await dynamoDB.scan(params).promise();

    const jsonResult = result.Items.map((item) =>
      AWS.DynamoDB.Converter.unmarshall(item)
    );

    return { statusCode: 200, body: JSON.stringify(jsonResult) };
  } catch (error) {
    const message = error?.message ? error.message : "Internal server error";
    return { statusCode: 500, body: JSON.stringify({ message: message }) };
  }
};

module.exports = searchProducts;
