import pool from "../../config/database.js";
import { BASE_URL } from "../../server.js";








// RECUPÉRER LES INFORMATIONS  DE MEMBER DANS  LA BASE DE DONNÉES //

export const getAllMembers = (req, res) => {
    let sql = `SELECT id, NOM_UTILISATEUR, EMAIL FROM MEMBER`;

    pool.query(sql, function (err, membres) {
        if (err) {
            console.error("Erreur lors de la récupération des membres :", err);
            res.status(500).render('errorPage');
        } else {
            
            console.log("Membres récupérés :", membres);
      
            res.locals.membres = membres; // Stocke les membres dans res.locals pour les rendre disponibles dans les vues
            res.render('profilAdmin', { membres:membres, base_url: BASE_URL });
        }
    });
};







