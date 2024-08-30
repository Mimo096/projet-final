

document.addEventListener('DOMContentLoaded', function() {
    // Sélectionnez tous les boutons avec la classe "delete-button"
    const deleteButtons = document.querySelectorAll('.delete-button');

    // Attachez un gestionnaire d'événements à chaque bouton
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const memberId = this.getAttribute('data-id');
            deleteMember(memberId);
        });
    });
});

function deleteMember(id) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
        fetch(`/delete_members/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                window.location.reload(); // Recharger la page après la suppression
            } else {
                alert("Erreur lors de la suppression du membre.");
            }
        })
        .catch(error => {
            console.error("Erreur lors de la requête de suppression :", error);
            alert("Erreur lors de la suppression du membre.");
        });
    }
}