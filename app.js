document.getElementById('subscriberForm').addEventListener('submit', function(event) {
    showLoader();
    event.preventDefault();

    const phoneNumber = document.getElementById('phoneNumber').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const domain = document.getElementById('domain').value;
    const status = document.getElementById('status').value;
    let callForwardNoReply_provisioned;
    if (document.getElementById('callForwardNoReply_provisioned').checked == true) {
        callForwardNoReply_provisioned = 1;
    } else {
        callForwardNoReply_provisioned = 0;
    }
    const callForwardNoReply_destination = document.getElementById('callForwardNoReply_destination').value;

    const data = {
        phoneNumber,
        username,
        password,
        domain,
        status,
        features: {
            callForwardNoReply: {
                provisioned: callForwardNoReply_provisioned,
                destination: callForwardNoReply_destination
            }
        }
    };

    fetch('subscriber_api.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('message').innerText = data.message || data.error;
        // retrieveSubscriber();
        clearForm();
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').innerText = 'An error occurred';
    });
    hideLoader();
});

function retrieveSubscriber() {
    showLoader();
    const phoneNumber = document.getElementById('retrievePhoneNumber').value;

    fetch(`subscriber_api.php?phoneNumber=${phoneNumber}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('message').innerText = data.error;
            document.getElementById('subscribersTable').style.display = 'none';
        } else {
            displaySubscriberInTable(data);
            document.getElementById('message').innerText = '';
            document.getElementById('phoneNumber').value = data.phoneNumber;
            document.getElementById('username').value = data.username;
            document.getElementById('password').value = data.password;
            document.getElementById('domain').value = data.domain;
            document.getElementById('callForwardNoReply_destination').value;
        }
        setTimeout(() => {
            document.getElementById('subscribersTable').scrollIntoView({ behavior: 'smooth' });
        }, 100);
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').innerText = 'An error occurred';
    });
    hideLoader();
}

function deleteSubscriber() {
    showLoader();
    const phoneNumber = document.getElementById('retrievePhoneNumber').value;

    fetch(`subscriber_api.php?phoneNumber=${phoneNumber}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('message').innerText = data.message || data.error;
        document.getElementById('subscribersTable').style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').innerText = 'An error occurred';
    });
    hideLoader();
}

function fetchAllSubscribers() {
    showLoader();
    fetch('subscriber_api.php', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('message').innerText = data.error;
            document.getElementById('subscribersTable').style.display = 'none';
        } else {
            displayAllSubscribersInTable(data);
            document.getElementById('message').innerText = '';
            document.getElementById('subscribersTable').scrollIntoView({ behavior: 'smooth' });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').innerText = 'An error occurred';
    });
    hideLoader();
}

function displaySubscriberInTable(subscriber) {
    const tableBody = document.getElementById('subscribersTableBody');
    tableBody.innerHTML = '';

    const row = document.createElement('tr');
    console.log(subscriber);
    
    row.innerHTML = `
        <td><a href="tel:${subscriber.phoneNumber}">${subscriber.phoneNumber}</a></td>
        <td>${subscriber.username}</td>
        <td>${subscriber.password}</td>
        <td><a href="${subscriber.domain}" target="_blank">${subscriber.domain}</a></td>
        <td>${subscriber.status}</td>
        <td>${subscriber.callForwardNoReply_destination ? 'Yes' : 'No'}</td>
        <td><a href="tel:${subscriber.callForwardNoReply_destination}">${subscriber.callForwardNoReply_destination}</a></td>
    `;
    tableBody.appendChild(row);

    document.getElementById('subscribersTable').style.display = 'table';
}

function displayAllSubscribersInTable(subscribers) {
    const tableBody = document.getElementById('subscribersTableBody');
    tableBody.innerHTML = '';

    subscribers.forEach(subscriber => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="tel:${subscriber.phoneNumber}">${subscriber.phoneNumber}</a></td>
            <td>${subscriber.username}</td>
            <td>${subscriber.password}</td>
            <td><a href="${subscriber.domain}" target="_blank">${subscriber.domain}</a></td>
            <td>${subscriber.status}</td>
            <td>${subscriber.callForwardNoReply_provisioned ? 'Yes' : 'No'}</td>
            <td><a href="tel:${subscriber.callForwardNoReply_destination}">${subscriber.callForwardNoReply_destination}</a></td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('subscribersTable').style.display = 'table';
}

function clearForm() {
    document.getElementById('phoneNumber').value = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('domain').value = '';
    document.getElementById('status').value = 'ACTIVE';
    document.getElementById('callForwardNoReply_provisioned').checked = false;
    document.getElementById('callForwardNoReply_destination').value = '';
}

let inputs = document.querySelectorAll('input');

inputs.forEach(item => {
    item.addEventListener('keypress', function(e){
        var key = e.keyCode;
        if (key === 32) {
        e.preventDefault();
        }
    });
});

document.getElementById('callForwardNoReply_provisioned').addEventListener('change', function(e){
    console.log(e.target.value);
    
    if (this.checked == true) {
        document.getElementById('callForwardNoReply_destination').removeAttribute('disabled');
        document.getElementById('callForwardNoReply_destination').setAttribute('required', true);
    } else {
        document.getElementById('callForwardNoReply_destination').setAttribute('disabled', true);
        document.getElementById('callForwardNoReply_destination').removeAttribute('required');
        document.getElementById('callForwardNoReply_destination').value = '';
    }
});

document.getElementById('phoneNumber').addEventListener('keypress', function(e){
    preventLetters(e);
});

document.getElementById('callForwardNoReply_destination').addEventListener('keypress', function(e){
    preventLetters(e);
});

function preventLetters(e) {
    if (e.key == '+') {
        // do nothing
    } else {
        if (e.shiftKey === true ) {
            if (e.keyCode == 9) {
                e.preventDefault();
            }
            e.preventDefault();
        }
        if (e.keyCode > 57) {
            e.preventDefault();
        }
        if (e.keyCode==32) {
            e.preventDefault();
        }
    }
}

function showLoader(){
    document.getElementById('blur-overlay').classList.add('active');
    document.getElementById('loader').classList.add('active');
    
}

function hideLoader(){
    document.getElementById('blur-overlay').classList.remove('active');
    document.getElementById('loader').classList.remove('active');
}