// Hardcoded actions
const actions = {
    accessDenied: 'Access denied',
    admin: 'Admin action executed', // Protected action
    user: 'User action executed'
}
// Hardcoded users
const users = {
    alice: 'admin',
    bob: 'user'
}

function login(username){
    if(users[username]){
        console.log(`Logged in as ${username} with role ${users[username]}`)
        return users[username]
    } else {
        console.log('Invalid username')
        return null
    }
}
// Access control logic
function performAction(role, action){
    if(action === 'admin' && role === 'admin') console.log(actions.admin)
    else if (action === 'user' && role === 'user') console.log(actions.user)
    else console.log(actions.accessDenied)
}

// Simulation
function main(){
    let role = login('alice')
    performAction(role, 'admin')
    performAction(role, 'user')

    console.log('\n---\n')

    role = login('bob')
    performAction(role, 'user')
    performAction(role, 'admin')
}

main()