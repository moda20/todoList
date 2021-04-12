
function register(event){
    event.preventDefault();
    event.stopImmediatePropagation();
    const data = new FormData(event.target);
    const userName = data.get('username');
    const password = data.get('password');
    if(!userName || !password) return;
    axios.post("/register", {
        username: userName,
        password
    }).then((response)=>{
        console.log(response);
        localStorage.setItem("_id", response.data._id)
        this.location.href="/auth"
    })
}

function login(event){
    event.preventDefault();
    event.stopImmediatePropagation();
    const data = new FormData(event.target);
    const userName = data.get('username');
    const password = data.get('password');
    if(!userName || !password) return;
    axios.post("/login", {
        username: userName,
        password
    }).then((response)=>{
        console.log(response);
        localStorage.setItem("Token", response.data.token)
        localStorage.setItem("_id", response.data._id)
        this.location.href="/tasks"
    })
}
