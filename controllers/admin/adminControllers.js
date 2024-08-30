import pool from "../../config/database.js";
import bcrypt from "bcryptjs";
import { BASE_URL } from "../../server.js";
import parseurl from "parseurl";




// Middleware qui protége les pages Admin //

 export const authMiddleware = (req, res, next) => {
    const pathname = parseurl(req).pathname.split('/')[1];
    const protectedPaths = ["getMembers", "profilAdmin","planningAjouterAdmin","Planning"]; // Ajoutez toutes les routes protégées ici

    console.log('Middleware auth activé pour la route :', pathname);
    console.log('Session isMember:', req.session.isMember);

    if (!req.session.isMember && protectedPaths.includes(pathname)) {
        // Redirection vers la page de connexion si l'utilisateur n'est pas authentifié
        return res.redirect("/adminLogin");
    } else {
        next();
    }
};







// REGISTER ADMIN //

 export const registerSubmitAdmin=(req,res)=>{


  const { email, password, passwordConfirm } = req.body;

  pool.query('SELECT EMAIL FROM ADMIN WHERE email = ?', [email], async (error, results) => {
      console.log('error', error);
      console.log('result', results);
  
      if (error) {
          console.log("error");
          return res.status(400).render('errorPage');
      }
  
      if (results.length > 0) {
          req.session.isAdmin = true;
          return res.status(400).render('registerAdmin', {
              message: 'Cet email est déjà utilisé'
          });
      }
  
      // Vérifier si les mots de passe correspondent
      if (password !== passwordConfirm) {
          return res.status(400).render('registerAdmin', {
              message: 'Le mot de passe ne correspond pas'
          });
      }
  
      // Vérifier si le mot de passe a au moins 8 caractères
      if (password.length < 8) {
          return res.status(400).render('registerAdmin', {
              message: 'Le mot de passe doit contenir au moins 8 caractères'
          });
      }
  
      // Vérifier si le mot de passe contient au moins une lettre majuscule et un caractère spécial
      const majusculeRegex = /[A-Z]/;
      const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  
      if (!majusculeRegex.test(password)) {
          return res.status(400).render('registerAdmin', {
              message: 'Le mot de passe doit contenir au moins une lettre majuscule'
          });
      }
  
      if (!specialCharRegex.test(password)) {
          return res.status(400).render('registerAdmin', {
              message: 'Le mot de passe doit contenir au moins un caractère spécial'
          });
      }
  
      // Si toutes les vérifications sont passées
      let hashedPassword = await bcrypt.hash(password, 8);
  
      pool.query('INSERT INTO ADMIN (NOM, EMAIL, MOT_DE_PASSE) VALUES (?, ?, ?)',
          [req.body.name, req.body.email, hashedPassword],
          (error, results) => {
              if (error) {
                  console.error('Une erreur s\'est produite:', error);
                  return res.status(500).send('Une erreur s\'est produite lors du traitement de votre demande');
              } else {
                  console.log(results);
                  return res.status(200).render('adminLogin', {
                      message: 'ADMIN enregistré avec succès'
                  });
              }
          });
  
      res.redirect("/adminLogin");
  });
 }


        
      
      // CONNEXION ADMIN SUBMIT //

       export const loginAdminSubmit = (req, res) => {
          const { email, password } = req.body;
      
          const selectQuery = 'SELECT * FROM ADMIN WHERE email = ?';
      
          pool.query(selectQuery, [email], async (error, results) => {
              console.log(error);
              console.log(results);
      
              if (results.length === 0) {
                  return res.render('adminLogin', {
                      message: 'L\'utilisateur n\'existe pas!'
                  });
              }
      
              const user = results[0];
              const isPassword = await bcrypt.compare(password, user.MOT_DE_PASSE);
      
              if (!isPassword) {
                  return res.render('adminLogin', {
                      message: 'Mauvais identifiants'
                  });
              }
      
              if (error) {
                  console.error('Erreur lors de la recherche :', error);
                  return res.send('Erreur du serveur');
              }
      
              const memberQuery = 'SELECT id, NOM_UTILISATEUR, EMAIL FROM MEMBER';
      
              pool.query(memberQuery, (error, members) => {
                  if (error) {
                      console.error('Erreur lors de la récupération des membres depuis la base de données :', error);
                      return res.status(500).render('errorPage');
                  }
      
                  req.session.isAdmin = true;
                  req.session.isMember = true;
                  // Assurer que members est correctement défini dans res.locals
                 
                  console.log("Session isAdmin:", req.session.isAdmin); // Debug: Affichez la session
                  console.log("Session isMember:", req.session.isMember); // Debug: Affichez la session
                  console.log("Membres récupérés:", members); // Debug: Affichez les membres
                
                  res.locals.members = members;  
                  // Maintenant, je peux l'utiliser dans le rendu de la vue
                  res.render('profilAdmin', { members: res.locals.members, base_url: BASE_URL });
              });
          });
      };
      
                 
// DECONNEXION ADMIN //
 export const LogoutAdmin = (req, res) => {
                req.session.destroy((err) => {
                    res.redirect("/adminLogin");
                });
            };







      


     

     

        















