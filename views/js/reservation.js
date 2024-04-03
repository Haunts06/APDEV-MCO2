$(document).ready(function() {
    // Add click event listener to non-occupied divs
    $('.grid-status-item').not('.occupied').click(function() {
        // Get the SlotID from the data-slotid attribute
        var slotID = $(this).data('slotid');
        
        // Create a hidden input field to hold the SlotID
        var input = $('<input>').attr({
            type: 'hidden',
            id: 'slotID',
            name: 'SlotID',
            value: slotID
        });
        
        // Append the hidden input to the form
        $('#grid-container').append(input);
        
        // Submit the form
        $('#grid-container').submit();
    });
});



function selectDate(element) {
    // Remove the selected class from all divs
    document.querySelectorAll('.grid-item').forEach(item => item.classList.remove('selected'));
    // Add the selected class to the clicked div
    element.classList.add('selected');
    // Store the selected date in a hidden input field
    document.getElementById('selectedDate').value = element.getAttribute('value');
}
function updateSelectedTime(selectedTime) {
    document.getElementById('selectedTime').value = selectedTime;
}

function showUserIDOnHover(element) {
    const userID = element.getAttribute('value');
    if (userID) {
        // Create a tooltip element to display the user ID
        const tooltip = document.createElement('div');
        tooltip.textContent = 'User ID:' + userID;
        tooltip.classList.add('tooltip');

        // Position the tooltip next to the hovered element
        const rect = element.getBoundingClientRect();
        tooltip.style.top = rect.top + window.pageYOffset + 'px';
        tooltip.style.left = rect.right + window.pageXOffset + 'px';

        // Append the tooltip to the document body
        document.body.appendChild(tooltip);

        // Remove the tooltip when mouse leaves the element
        element.addEventListener('mouseleave', function () {
            tooltip.remove();
        });
    }
}
