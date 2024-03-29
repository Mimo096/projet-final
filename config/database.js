import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

let pool = mysql.createPool({
	host: process.env.DATABASE_HOST, // on rentre l'hôte l'adresse url où se trouve la bdd
	user: process.env.DATABASE_USER, // identifiant BDD
	password: process.env.DATABASE_PASSWORD , // le password
	database: process.env.DATABASE, // nom de la base de donnée
});

pool.getConnection((err, connection) => {
	console.log("connexion à ma bdd  !");

	if (err) throw err;
});

export default pool;
