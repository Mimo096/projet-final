import pool from "../../config/database.js";
import bcrypt from "bcryptjs";
import { BASE_URL } from "../../server.js";




export const RegisterUserSubmit = (req, res) => {
  const { email, password, passwordConfirm } = req.body;

  // On vérifie si un utilisateur avec cet email existe en BDD
  pool.query('SELECT * FROM MEMBER WHERE EMAIL = ?', [email], async (error, results) => {
      console.log('error', error);
      console.log('result', results);

      if (error) {
          console.log("error");
          return res.status(500).render('errorPage', {
              message: 'Une erreur s\'est produite lors de la vérification de l\'email'
          });
      }

      if (!email || !password || !passwordConfirm) {
          return res.status(400).render('register', {
              message: 'Veuillez remplir tous les champs',
          });
      }

      if (results.length > 0) {
          return res.status(400).render('register', {
              message: 'Cet email est déjà utilisé'
          });
      }

      // Vérifier si les mots de passe correspondent
      if (password !== passwordConfirm) {
          return res.status(400).render('register', {
              message: 'Le mot de passe ne correspond pas'
          });
      }

      // Vérifier si le mot de passe a au moins 8 caractères
      if (password.length < 8) {
          return res.status(400).render('register', {
              message: 'Le mot de passe doit contenir au moins 8 caractères'
          });
      }

      // Vérifier si le mot de passe contient au moins une lettre majuscule et un caractère spécial
      const majusculeRegex = /[A-Z]/;
      const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

      if (!majusculeRegex.test(password)) {
          return res.status(400).render('register', {
              message: 'Le mot de passe doit contenir au moins une lettre majuscule'
          });
      }

      if (!specialCharRegex.test(password)) {
          return res.status(400).render('register', {
              message: 'Le mot de passe doit contenir au moins un caractère spécial'
          });
      }

      // Si toutes les vérifications sont passées
      let hashedPassword = await bcrypt.hash(password, 8);

      // Insertion des informations d'utilisateur
      pool.query('INSERT INTO MEMBER (NOM_UTILISATEUR, EMAIL, MOT_DE_PASSE) VALUES (?, ?, ?)',
          [req.body.name, req.body.email, hashedPassword],
          (error, results) => {
              if (error) {
                  console.log(error);
                  return res.status(500).render('errorPage', {
                      message: 'Une erreur s\'est produite lors de l\'enregistrement de l\'utilisateur'
                  });
              } else {
                  console.log(results);
                  return res.status(200).render('login', {
                      message: 'Utilisateur enregistré avec succès'
                  });
              }
          });
  });
}
//Je vérifie si un utilisateur avec cet email existe en bdd 

export const LoginSubmitUser = async (req, res) => {
  const { email, password } = req.body;


  if (!email || !password) {
    return res.render('login', {
        message: 'Veuillez remplir tous les champs ',
    })};

    const query = 'SELECT * FROM MEMBER WHERE EMAIL = ?';
    console.log('Requête SQL :', query);

    pool.query(query, [email], async (error, results) => {
        if (error) {
            console.log('Erreur SQL :', error);
            return res.render('login', {
                message: 'Une erreur est survenue lors de la connexion. Veuillez réessayer.',
            });
        }
      
      
      if (results.length === 0) {
          return res.render('login', {
              message: 'utilisateur existe pas !',
          });
      }

      const user = results[0];
      let nom, prenom; // Déclarer les variables à l'extérieur de la condition

      const isPassword = await bcrypt.compare(password, user.MOT_DE_PASSE);
      if (!isPassword) {
          return res.render('login', {
              message: 'Mauvais identifiants ',
          });
      }
      else 
      req.session.ismember = true;
      req.session.userId = user.ID;

      const fullName = user.NOM_UTILISATEUR;
      [nom, prenom] = fullName.split(" "); // Initialiser les variables ici

      req.session.nom = nom; // Stocker le nom de l'utilisateur dans la session
      req.session.prenom = prenom;

      console.log('ID du membre après connexion :', user.ID);

       res.locals.id_membre = user.ID;
       req.session.userId = user.ID;
      // Passer les variables locales à la vue ProfilUser
      res.render("profilUser", { nom, prenom, id_membre: user.ID });
  });
};


// mettre a jour mon mot de passe (user) // 


export const changerPasword = (req, res) => {
    const userId = req.session.userId;
  
    if (!userId) {
      // L'utilisateur n'est pas connecté, rediriger-le vers la page de connexion
      console.log('Utilisateur non connecté, redirection vers la page de connexion.');
      return res.redirect('/login');
    }
  
    // Affichez le formulaire de modification de mot de passe
    console.log('Affichage du formulaire de changement de mot de passe.');
    res.render('changePassword');
  };
  
  // Met à jour le mot de passe
  export const updatePassword = async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    const isValidPassword = validatePassword(newPassword);
    if (!isValidPassword) {
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, et un caractère spécial.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updateQuery = 'UPDATE MEMBER SET MOT_DE_PASSE = ? WHERE ID = ?';
        pool.query(updateQuery, [hashedPassword, userId], (error, results) => {
            if (error) {
                console.error("Erreur lors de la mise à jour de la base de données:", error);
                return res.status(500).json({ message: 'Erreur lors de la mise à jour du mot de passe' });
            }

            res.status(200).json({ message: 'Votre mot de passe a été modifié avec succès.' });
        });
    } catch (error) {
        console.error("Erreur lors du traitement du mot de passe:", error);
        res.status(500).json({ message: 'Une erreur est survenue lors du traitement du mot de passe.' });
    }
};

function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUpperCase && hasSpecialChar;
}


// DECONNEXION DE USER //
    
    export const LogoutUser = (req, res) => {
        req.session.destroy((err) => {
            res.redirect("/login");
        });
    };



    // AUTHENTIFICATION DE  L'UTILISATEUR // 

 export const AuthenticationUser = (req,res) =>{
	if (req.session.ismember) {
		
		
		res.render('reservation', {id_member:req.session.userId});
	  } else {
	
		res.redirect('/login'); 
	  }
};


    
    
    