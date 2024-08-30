document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner toutes les images à l'intérieur de l'élément ayant la classe '.dream'
    const images = document.querySelectorAll('.dream img');

    // Ajoutez un gestionnaire d'événements à chaque image
    images.forEach(image => {
        image.addEventListener('click', function() {
            // code à exécuter lors du clic
            document.querySelector('.poupin').style.display = "block";
            document.querySelector('.poupin img').src = image.getAttribute('src');
        });
    });
});

document.querySelector('.poupin span').onclick = () => {
    document.querySelector('.poupin').style.display = "none";
};