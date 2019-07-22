
list = [
    {
        listId: 1,
        listTitle: 'Title 1',
        tasks: [
            { id: 1, name: 'task1' },
            { id: 2, name: 'task2', },
        ]
    },
    {
        listId: 2,
        listTitle: 'Title 2',
        tasks: [
            { id: 1, name: 'tas2' },
            { id: 2, name: 'task3', },
        ]
    }
]



function renderHtml() {
    $('#list-container').empty();
    var listHtml = `<div class="col-sm-3" >
          <div class="card" id="{{listId}}" ondrop="drop(event, this)"  ondragover="allowDrop(event)">
            <div class="card-body">
              <h5 class="card-title">{{listTitle}}</h5>
            </div>
          </div>
        </div>`;

    var addList = `
              <div class="card" id="list-add-link">
                  <a href="#" class="link" onClick="openInputAddList()">add List</a>
              </div>
              
              <div class="d-none"  id="list-input-cont">
                <input id="list-input" type="text" class="form-control "  placeholder="add list" value="">
                <button type="button" onClick="addList()" class="btn btn-success">Add List</button>  
              </div>
    `

    var addTask = `
    <div class="card" id="task-add-link-{{listId}}">
        <a href="#" data-list-id="{{listId}}" class="link" onClick="openInputAddTask(this)">add Task</a>
    </div>
    
    <div class="d-none"  id="task-input-cont-{{listId}}">
      <input id="task-input-{{listId}}" data-list-id="{{listId}}"  type="text" class="form-control "  placeholder="add task" value="">
      <button type="button" data-list-id="{{listId}}"   onClick="addTask(this)" class="btn btn-success">Add Task</button>  
    </div>
`

    var taskHtml = `<div draggable="true" ondragstart="drag(event, this)" data-list-task="{{listId}}-{{taskId}}"  id="{{taskId}}" class="alert alert-info" role="alert">
                 {{taskname}}
                 <i class="fas fa-trash float-right" data-list-task="{{listId}}-{{taskId}}" onClick="deleteTask(this)"></i>
              </div>`;

    $.each(list, function (index, element) {
        var listElement = listHtml.replace(/{{listTitle}}/g, element.listTitle);
        listElement = listElement.replace(/{{listId}}/g, 'list-' + element.listId);
        $('#list-container').append(listElement);

        $.each(element.tasks, function (index, task) {
            var taskElement = taskHtml.replace(/{{taskname}}/g, task.name);
            taskElement = taskElement.replace(/{{listId}}/g, element.listId);
            taskElement = taskElement.replace(/{{taskId}}/g, task.id);
            $('#' + 'list-' + element.listId).append(taskElement);
        })
        $('#' + 'list-' + element.listId).append(addTask.replace(/{{listId}}/g, element.listId));
    });

    $('#list-container').append(addList);
}

function addList() {
    if ($('#list-input').val().length > 0) {
        id = list.length > 0 ? _.max(_.pluck(list, 'listId')) : 0;
        var obj = { listId: id + 1, listTitle: $('#list-input').val(), tasks: [] }
        list.push(obj);
        renderHtml();
    } else {
        return
    }
    renderHtml();
}


function openInputAddList() {
    $('#list-input-cont').removeClass('d-none');
    $('#list-add-link').addClass('d-none');
}


function openInputAddTask(elem) {
    var id = $(elem).data('list-id');
    $('#task-add-link-' + id).addClass('d-none');
    $('#task-input-cont-' + id).removeClass('d-none');
}



function addTask(ele) {
    var listId = $(ele).data('list-id');
    listEle = _.findWhere(list, { listId: listId });
    if ($('#task-input-' + listId).val().length > 0) {
        id = listEle.tasks.length > 0 ? _.max(_.pluck(listEle.tasks, 'id')) : 0;
        var obj = { id: id + 1, name: $('#task-input-' + listId).val() }
        listEle.tasks.push(obj);
        renderHtml();
    } else {
        return
    }
}


function drag(event, ele) {
    console.log($(ele).data('list-task'));
     
}

function drop(event, ele) {

    console.log('drop event')
}


function allowDrop(ev) {
    ev.preventDefault();
  }


  function deleteTask(ele){
    var ele = $(ele).data('list-task');
    var listId = ele.split("-")[0];
    var taskId = ele.split("-")[1];

    var listEle = _.findWhere(list, {listId:  parseInt(listId)})
    var index = _.findIndex(listEle.tasks, function(task){
        return task.id == parseInt(taskId) ;
    }) 
    listEle.tasks.splice(index, 1);
    renderHtml();
  }