function validerFormulaire() {
    // Récupérer les valeurs des champs
    var nomValue = document.getElementById("name").value;
    var emailValue = document.getElementById("email").value;
    var passwordValue = document.getElementById("password").value;
    var passwordConfirmValue = document.getElementById("passwordConfirm").value;

    // Vérifier si tous les champs sont remplis
    if (nomValue.trim() === "" || emailValue.trim() === "" || passwordValue.trim() === "" || passwordConfirmValue.trim() === "") {
        alert("Veuillez remplir tous les champs.");
        return false;
    }

    // Vérifier si les mots de passe correspondent
    if (passwordValue !== passwordConfirmValue) {
        alert("Les mots de passe ne correspondent pas.");
        return false;
    }

    // Valider le mot de passe
    if (!isValidPassword(passwordValue)) {
        alert("Le mot de passe doit contenir au moins 8 caractères, une majuscule et un caractère spécial.");
        return false;
    }

    // Si tout est valide, autoriser la soumission
    return true;
}

// Fonction pour valider le mot de passe
function isValidPassword(password) {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[!@#$%^&*(),.?":{}|<>]/.test(password);
}