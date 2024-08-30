

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('changePasswordForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const newPassword = form.querySelector('input[name="newPassword"]').value;
        const confirmPassword = form.querySelector('input[name="confirmPassword"]').value;

        try {
            const response = await fetch('/updatePassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newPassword, confirmPassword })
            });

            const result = await response.text();
            if (response.ok) {
                alert(result);
            } else {
                alert('Erreur: ' + result);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du mot de passe:', error);
            alert('Erreur lors de la mise à jour du mot de passe');
        }
    });
});