const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User {
  constructor(name, password, email, contactNumber) {
    this.name = name;
    this.password = password;
    this.email = email;
    this.contactNumber = contactNumber;
  }

  static async getAllUsers() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM AccountUser`;
    const request = connection.request();
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset.map(
      (row) => new User(row.name, row.password, row.email, row.contactNumber)
    );
  }

  static async getUserById(id) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM AccountUser WHERE id = @id`;
    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset[0]
      ? new User(
          result.recordset[0].name,
          result.recordset[0].password,
          result.recordset[0].email,
          result.recordset[0].contactNumber
        )
      : null;
  }

  static async createUserAccount(newUserAccount) {
    try {
      const connection = await sql.connect(dbConfig);
      
      const sqlQuery = `
        INSERT INTO AccountUser (name, password, email, contactNumber)
        VALUES (@name, @password, @email, @contactNumber);
        SELECT SCOPE_IDENTITY() AS userId;`;
  
      const request = connection.request();
      request.input("name", newUserAccount.name);
      request.input("password", newUserAccount.password);
      request.input("email", newUserAccount.email);
      request.input("contactNumber", newUserAccount.contactNumber);
  
      const result = await request.query(sqlQuery);
  
      connection.close();
  
      const userId = result.recordset[0].userId; // Access the userId from the result
  
      return this.getUserById(userId); // Return the newly created user
    } catch (error) {
      console.error("Error creating user:", error);
      throw error; // Re-throw the error to be caught by the caller (usersController)
    }
  }

  static async getUserByNameAndPassword(name, password) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = 'SELECT * FROM AccountUser WHERE name = @name AND password = @password';
      const request = connection.request();
      request.input('name', sql.NVarChar, name);
      request.input('password', sql.NVarChar, password);
      const result = await request.query(sqlQuery);
      connection.close();
      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      console.error('Error retrieving user:', error);
      throw error; // Throw error to be caught by the controller
    }
  }
}

module.exports = User;