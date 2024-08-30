import pool from "../../config/database.js";
import bcrypt from "bcryptjs";




export const renderProfilAdmin = async (req, res, message = '') => {
    try {
        const members = await getAllMembersFromDb();
        res.render('profilAdmin', { members: members, message: message });
    } catch (error) {
        console.error("Erreur lors de la récupération des membres :", error);
        res.status(500).send("Erreur lors de la récupération des membres.");
    }
};

export const AddUser = async (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;
    console.log("Requête POST reçue avec les données :", { name, email, password, passwordConfirm });

    if (!name || !email || !password || !passwordConfirm) {
        return renderProfilAdmin(req, res, "Veuillez remplir tous les champs.");
    }

    if (password !== passwordConfirm) {
        return renderProfilAdmin(req, res, "Les mots de passe ne correspondent pas. Veuillez réessayer.");
    }

    if (password.length < 8) {
        return renderProfilAdmin(req, res, "Le mot de passe doit contenir au moins 8 caractères.");
    }

    const majusculeRegex = /[A-Z]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (!majusculeRegex.test(password)) {
        return renderProfilAdmin(req, res, "Le mot de passe doit contenir au moins une lettre majuscule.");
    }

    if (!specialCharRegex.test(password)) {
        return renderProfilAdmin(req, res, "Le mot de passe doit contenir au moins un caractère spécial.");
    }

    try {
        const emailExists = await checkIfEmailExists(email);
        if (emailExists) {
            return renderProfilAdmin(req, res, "Cet email est déjà utilisé. Veuillez en choisir un autre.");
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        await insertUser(name, email, hashedPassword);

        const members = await getAllMembersFromDb();
        console.log("Utilisateur ajouté avec succès.");
        return renderProfilAdmin(req, res, "L'utilisateur a été ajouté avec succès.");

    } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur :", error);
        return renderProfilAdmin(req, res, "Une erreur est survenue lors de l'ajout de l'utilisateur. Veuillez réessayer.");
    }
};

export const DeletePost = async (req, res) => {
    let id = req.params.id;

    try {
        let sql = `DELETE FROM MEMBER WHERE id = ?`;
        pool.query(sql, [id], async (err, results, fields) => {
            if (err) {
                console.error("Erreur lors de la suppression du membre :", err);
                return renderProfilAdmin(req, res, "Une erreur est survenue lors de la suppression du membre. Veuillez réessayer.");
            }
            console.log("Utilisateur supprimé avec succès.");
            return renderProfilAdmin(req, res, "L'utilisateur a été supprimé avec succès.");
        });
    } catch (error) {
        console.error("Erreur lors de la suppression du membre :", error);
        return renderProfilAdmin(req, res, "Une erreur est survenue lors de la suppression du membre. Veuillez réessayer.");
    }
};

// Fonction pour obtenir tous les membres depuis la base de données
async function getAllMembersFromDb() {
    return new Promise((resolve, reject) => {
        pool.query("SELECT id, NOM_UTILISATEUR, EMAIL FROM MEMBER", (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

// Fonction pour insérer un utilisateur dans la base de données
async function insertUser(name, email, hashedPassword) {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO MEMBER SET ?", { NOM_UTILISATEUR: name, EMAIL: email, MOT_DE_PASSE: hashedPassword }, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

// Fonction pour vérifier si un email existe dans la base de données
async function checkIfEmailExists(email) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM MEMBER WHERE EMAIL = ?", [email], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.length > 0); // Retourne true si des résultats sont trouvés
            }
        });
    });
}