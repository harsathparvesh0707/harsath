const defaultStore = {
    Data:[],
    Name:"",
    password:"",
    email:""
}
export default function(state = defaultStore, action = {}) {
    switch (action.type) {
        case "TodoData":
            return {
            ...state,
            Data:action.Data
            }
        case "Name":
            return {
                ...state,
                Name:action.Name
            }
        case "password":
            return {
                ...state,
                password:action.password
            }
        case "email":
            return {
                ...state,
                email:action.email
            }
        default:  
            return state;
    }    
}  