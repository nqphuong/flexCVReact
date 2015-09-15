var EducationTitle = React.createClass({
	componentDidMount: function(){
		jQuery("#modif_edu_add").bind("click", function(e){
			e.preventDefault();
			var action = getSiteUrl() + "controller/SiteController.php?action=addneweducation";
			var mode = "new";
			
			reactClickEvent("education", "modif_edu_add");
			React.render(
				<AddEducationPanelContent
					action={action} mode={mode} title="" description="" year=""
					onRefresh={this.refreshView}/>,
				document.getElementById('modifyPanel-content')
			);
			
			return false;
		}.bind(this));
	},
	refreshView: function(data){
		this.props.onUpdate(data);
		closeProduct();
	},
	render: function(){
		return(
			<div className="title">
                <div className="overlay">
                    <a id="modif_edu_add" href="html/calljson.php">
                        <span className="fa fa-plus-square fa-2x"></span>
                    </a>
                </div>
                <h2>// {this.props.title}</h2>
            </div>
		);
	}
});

var EducationItem = React.createClass({
	//Remove item
	removeHandler: function(index){
		var url = this.props.actionRemove;
		$.ajax({
			url:url,
			type:'post',
			data:{index:index, dir:'data', file:'education.json'},
			success: function(data){
				if (data.charAt(0) != '-') {
					this.refreshView(JSON.parse(data));//Parse string to JSON object before re-rendering
				}
			}.bind(this),
			error: function(xhr, status, err){
				console.error('Err: Remove education item', status, err.toString());
			}.bind(this)
		});
	},
	
	//Update item
	updateHandler: function(index){
		this.showPanel(index);
	},
	
	//Show modification panel
	showPanel:function(index){
		var action = this.props.actionUpdate;
		var mode = "update";
		reactClickEvent("education", "modif_edu_add");
		React.render(
			<AddEducationPanelContent
				action={action} mode={mode} index={index}
				title={this.props.title}
				description={this.props.description}
				year={this.props.year}
				onRefresh={this.refreshView}/>,
			document.getElementById('modifyPanel-content')
		);
	},
	
	//Update view after removing or modification item content
	refreshView: function(data){
		this.props.onUpdateItem(data);
	},
	render: function(){
		return(
			<li>
				<div className="overlay">
					<a id="modif_edu_remove" onClick={this.removeHandler.bind(this, this.props.index)}>
						<span className="fa fa-eye-slash fa-2x"></span>
					</a>
					<a id="modif_edu_change" onClick={this.updateHandler.bind(this, this.props.index)}>
						<span className="fa fa-pencil fa-2x m-r-5px"></span>
					</a>
				</div>
				<div className="year">{this.props.year}</div>
				<div className="description">
					<h3>{this.props.title}</h3>
					<p>{this.props.description}</p>
				</div>
			</li>
		);
	}
});

var EducationList = React.createClass({
	updateHandler: function(data){
		this.props.onUpdate(data);
	},
	
	render: function(){
		//Read properties
		var actionRemove = this.props.actionRemove;
		var actionUpdate = this.props.actionUpdate;
		var data = this.props.data;
		
		var educationList = data.map(function(detail, index){
			return (
				<EducationItem year={detail.year}
								title={detail.title}
								description={detail.description}
								index={index}
								actionRemove={actionRemove}
								actionUpdate={actionUpdate}
								/*1 *//*onUpdateItem={this.updateHandler}*/
								/*or 2*/onUpdateItem={this.props.onUpdate}/>
			);
		}, this); //Add map function to this class. Important to call onUpdateItem() in child class.
		
		return(
			<ul className="education clearfix">
				{educationList}
			</ul>
		);
	}
});

var EducationBox = React.createClass({
	//Load data from url request
	loadComponentFromServer: function(){
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			success: function(data){
				this.setState({data:data});
			}.bind(this),
			error: function(xhr, status, err){
				console.error(this.props.url, status, err.toString());
			}.bind(this),
		});
	},
	
	//Initial state variables
	getInitialState: function(){
		return {
			data:[],
		};
	},
	
	//Mount function startup
	componentDidMount: function(){
		this.loadComponentFromServer();
	},
	
	updateHandler: function(data){
		this.setState({data:data});
	},
	
	//Main
    render: function(){
        return (
			<div>
				<EducationTitle title="Education"
								onUpdate={this.updateHandler}/>
				<EducationList data={this.state.data}
								actionRemove={this.props.actionRemove}
								actionUpdate={this.props.actionUpdate}
								onUpdate={this.updateHandler}
				/>
			</div>
        );
    }
});

/**Add new content panel
 */
var AddEducationPanelContent = React.createClass({
	componentDidMount: function(){
		//Mount submit function to html element after rendering
		var url = this.props.action;
		var mode = this.props.mode;
		var updateIndex = this.props.index;
		jQuery('#f-add-education').submit(function(){
			var title = $('#f-add-education .edtitle').val();
			var description = $('#f-add-education .eddesc').val();
			var year = $('#f-add-education .edyear').val();
			
			//Initial values tranfered
			var data = {};
			if (mode == 'new') {
				data = {title:title, description:description, year:year, dir:'data', file:'education.json'};
			} else {
				data = {title:title, description:description, year:year, dir:'data', file:'education.json', index:updateIndex};
			}
			
			$.ajax({
				url: url,
				type: "post",
				data: data,
				success: function(data){
					if (data.charAt(0) != '-') {
						//Reload the parent view after removing/modification
						this.refreshParentView(JSON.parse(data));
					}
				}.bind(this),
				error: function(xhr, status, err){
					console.error(url, status, err.toString());
				}.bind(this)
			});
			
			return false; //Don't reload the page. Let React do it!
		}.bind(this));
	},
	refreshParentView: function(data){
		this.props.onRefresh(data);
		//Close modification panel
		closeProduct();
	},
	render: function(){
		return(
			<div class="row">
				<div class="col-xs-12">
					<form id="f-add-education">
						<p>Add/Modify your education info:</p>
						<p>Title:</p>
						<input className="edtitle" type="text" placeholder="Text" defaultValue={this.props.title}/><p></p>
						
						<p>Description:</p>
						<textarea className="eddesc" placeholder="Text" defaultValue={this.props.description}></textarea><p></p>

						<p>Year:</p>
						<input className="edyear m-b-10px" type="text" placeholder="YYYY" defaultValue={this.props.year}/><p></p>
						
						<button className="btn btn-success">Update</button>
					</form>
				</div>
			</div>
		);
	}
});

/*Main
 **/
//Render education box with action url for each education item and url to load content when rendering
var actionRemove = getSiteUrl() + "controller/SiteController.php?action=removeeducation";
var actionUpdate = getSiteUrl() + "controller/SiteController.php?action=updateeducation";
React.render(
    <EducationBox url="data/education.json"
					actionRemove={actionRemove}
					actionUpdate={actionUpdate}
	/>, document.getElementById('education')
);