if(!localStorage.getItem("Token")){
    location.href="/auth";
}
const currentUser = localStorage.getItem('_id');


function disconnect(){
    localStorage.removeItem('Token');
    localStorage.removeItem('_id');
    location.href="/auth";
}
function getAllTasks(){
    axios.post("/graphql", {
        query: `{tasks {title, text, user {username, _id}, comments { title, taskID, userID {username, _id}, text, _id}, _id, status}}`
    }, {
        headers: {
            "Authorization": `JWT ${localStorage.getItem("Token")}`
        }
    }).then((response)=>{
        let innerTasksHTML = "";
        let innerCommentHTML = "";
        response?.data?.data?.tasks?.forEach((e)=>{
            let statusbadgeColor = e.status === 1
                ? '<span class="badge badge-primary">started</span>'
                : e.status === 2
                    ? '<span class="badge badge-success">Finished</span>'
                    : '<span class="badge badge-danger">Unfinished</span>'

            let tss = `<a id="task${e._id}" class="list-group-item list-group-item-action flex-column align-items-start" data-toggle="list" href="#comment${e._id}" role="tab" aria-controls="home">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${e.title}</h5>
                    <small><span class="badge badge-primary badge-pill">${e.comments?.length} Cmnts.</span></small>
                </div>
                <p class="mb-1">${e.text}</p>
                <div class="d-flex flex-grow">
                    <button class="btn btn-danger mr-auto"  ${(currentUser !== e?.user?._id) ? 'disabled':''} onclick="deleteTask('${e._id}')"><i class="fa fa-close"></i></button>
                    <button class="btn btn-primary-outline ml-auto" onclick="cycleTaskStatus('${e._id}', '${e.status}')">
                        ${statusbadgeColor}
                    </button>
                    <button class="btn btn-secondary ml-auto" onclick="openCommentModal('${e._id}')">Comment</button>
                </div>
            </a>`
            innerTasksHTML += tss;
            innerCommentHTML += `<div class="tab-pane fade" id="comment${e._id}" role="tabpanel" aria-labelledby="list-home-list">
                    <ul class="list-group">
                        ${e.comments.map((cmnt)=>{
                return `<li class="list-group-item d-flex justify-content-between align-items-center">
                                       <h5>${cmnt?.title}</h5>
                                       <p class="ml-2">${cmnt?.text}</p>
                                       <p>by : ${cmnt?.userID?.username}</p>
                                       <div class="d-flex flex-grow">
                                            <button class="btn btn-primary-outline ml-auto " ${(currentUser !== cmnt?.userID?._id) ? 'disabled':''} onclick="deleteComment('${cmnt._id}')">delete</button>
                                        </div>
                                    </li>`
            }).join('\n')}
                    </ul>
            </div>`
        })
        $("#tasksList").html(innerTasksHTML);
        $("#commentList").html(innerCommentHTML);
    })
}

getAllTasks();



function openCommentModal(taskId){
    const userId = localStorage.getItem("_id");
    if(!userId) return;
    $("#commentTaskIdId").val(taskId);
    $("#commentUserId").val(userId);
    $("#addCommentModal").modal("show");
}
function openNewTaskModal(){
    $("#newTaskUserID").val(currentUser);
    $('#addtaskModal').modal('show')
}

function addTask(event){
    event.stopImmediatePropagation();
    event.preventDefault();
    if(!currentUser) return;
    const data = new FormData(event.target);
    const title = data.get('title');
    const text = data.get('text');
    if(!title || !text) return;
    axios.post("/graphql", {
        query: `mutation {addTask(title:"${title}", text:"${text}", status:1, user:"${currentUser}") {
                title,
                text,
                _id
            }}`
    }, {
        headers: {
            "Authorization": `JWT ${localStorage.getItem("Token")}`
        }
    }).then((data)=>{
        this.location.href="/tasks"
    })
}

function deleteTask(_id){
    if(!_id ) return;
    if(!currentUser) return;
    axios.post("/graphql", {
        query: `mutation {deleteTask(_id:"${_id}", user:"${currentUser}") {
                title,
                text,
                _id
            }}`
    }, {
        headers: {
            "Authorization": `JWT ${localStorage.getItem("Token")}`
        }
    }).then((data)=>{
        this.location.href="/tasks"
    })
}

function addComment(event){
    event.stopImmediatePropagation();
    event.preventDefault();
    const data = new FormData(event.target);
    const title = data.get('title');
    const text = data.get('text');
    const taskID = data.get('taskId');
    const userID = data.get('userId');
    if(!title || !text) return;
    axios.post("/graphql", {
        query: `mutation {addComment(title:"${title}", text:"${text}", user:"${userID}", task:"${taskID}") {
                title,
                text,
                _id
            }}`
    }, {
        headers: {
            "Authorization": `JWT ${localStorage.getItem("Token")}`
        }
    }).then((data)=>{
        this.location.href="/tasks"
    })
}
function deleteComment(_id){
    let userId = currentUser;
    if(!_id || !userId) return;
    axios.post("/graphql", {
        query: `mutation {deleteComment(_id:"${_id}", user:"${userId}") {
                title,
                text,
                _id
            }}`
    }, {
        headers: {
            "Authorization": `JWT ${localStorage.getItem("Token")}`
        }
    }).then((data)=>{
        this.location.href="/tasks"
    })
}

function cycleTaskStatus(taskID, status){
    let newStatus = parseInt(status);
    switch (parseInt(status)){
        case 1: newStatus = 2; break;
        case 2: newStatus = 3; break;
        case 3: newStatus = 2; break;
    }
    changeTaskStatus(taskID, newStatus);
}

function changeTaskStatus(taskID, status){
    let userId = currentUser;
    if(!taskID || !status) return;
    axios.post("/graphql", {
        query: `mutation {changeTaskStatus(_id:"${taskID}", user:"${userId}", status:${status}) {
                title,
                text,
                _id
            }}`
    }, {
        headers: {
            "Authorization": `JWT ${localStorage.getItem("Token")}`
        }
    }).then((data)=>{
        this.location.href="/tasks"
    })
}
