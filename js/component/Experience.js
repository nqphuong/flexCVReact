var ExperienceTitle = React.createClass({
	componentDidMount: function(){
		jQuery("#modif_exp_add").bind("click", function(e){
			e.preventDefault();
			var action = getSiteUrl() + "controller/SiteController.php?action=addnewexperience";
			var mode = "new";

			reactClickEvent("experiences", "modif_exp_add");
			React.render(
				<AddExperienceContent
					action={action} mode={mode} company="" title="" description="" year=""
					onRefresh={this.refreshParentView}/>,
				document.getElementById('modifyPanel-content')
			);

			return false;
		}.bind(this));
	},
	refreshParentView: function(data){
		this.props.onUpdate(data);
		closeProduct();
	},
	render: function(){
		return (
			<div className="title">
				{
					allowModif() ?
					<div className="overlay">
						<a id="modif_exp_add" href="html/calljson.php">
							<span className="fa fa-plus-square fa-2x"></span>
						</a>
					</div> : ''
				}

                <h2>// {this.props.title}</h2>
            </div>
		);
	}
});

var ExperienceItem = React.createClass({
	removeHandler: function(index){
		var url = this.props.actionRemove;
		$.ajax({
			url:url,
			type:'post',
			data:{index:index, dir:'data', file:'experience.json'},
			success: function(data){
				if (data.charAt(0) != '-') {
					this.refreshView(JSON.parse(data));
				}
			}.bind(this),
			error: function(xhr, status, err){
				console.error('Err: Remove item', status, err.toString());
			}.bind(this)
		});
	},
	updateHandler:function(index){
		this.showPanel(index);
	},
	refreshView: function(data){
		this.props.onUpdate(data);
	},
	//Show modification panel
	showPanel:function(index){
		var action = this.props.actionUpdate;
		var mode = "update";
		reactClickEvent("experiences", "modif_exp_add");
		React.render(
			<AddExperienceContent
				action={action} mode={mode} index={index}
				company={this.props.company}
				title={this.props.title}
				description={this.props.description}
				year={this.props.year}
				onRefresh={this.refreshView}/>,
			document.getElementById('modifyPanel-content')
		);
	},
	render: function(){
		return (
			<div className="job clearfix">
				{
					allowModif() ?
	                <div className="overlay">
	                    <a id="modif_exp_remove" onClick={this.removeHandler.bind(this, this.props.index)}>
	                        <span className="fa fa-eye-slash fa-2x"></span>
	                    </a>
	                    <a id="modif_exp_change" onClick={this.updateHandler.bind(this, this.props.index)}>
	                        <span className="fa fa-pencil fa-2x m-r-5px"></span>
	                    </a>
	                </div> : ''
				}
                <div className="col-xs-3">
                    <div className="company">{this.props.company}</div>
                    <div className="year">{this.props.year}</div>
                </div>
                <div className="col-xs-9">
                    <div className="title">{this.props.title}</div>
                    <div className="description">{this.props.description}</div>
                </div>
            </div>
		);
	}
});

var ExperienceList = React.createClass({
	updateHandler: function(data){
		this.props.onUpdate(data);
	},
	render: function(){
		var experienceList = this.props.data.map(function(detail, index){
			return (
				<ExperienceItem company={detail.company}
								year={detail.year}
								title={detail.title}
								description={detail.description}
								index={index}
								actionRemove={this.props.actionRemove}
								actionUpdate={this.props.actionUpdate}
								onUpdate={this.updateHandler}/>
			);
		}, this);

		return(
			<div>
				{experienceList}
			</div>
		);
	}
});

var ExperienceBox = React.createClass({

	loadDataFromServer: function(){
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

	componentDidMount: function(){
		this.loadDataFromServer();
	},

	getInitialState: function(){
		return {
			data:[],
		};
	},

	updateHandler: function(data){
		this.setState({data:data});
	},

    render: function(){
        return(
			<div>
				<ExperienceTitle title="Experiences"
								onUpdate={this.updateHandler}/>
				<ExperienceList data={this.state.data}
								actionRemove={this.props.actionRemove}
								actionUpdate={this.props.actionUpdate}
								onUpdate={this.updateHandler}/>
			</div>
        );
    }
});

/**Add new content panel
 */
var AddExperienceContent = React.createClass({
	componentDidMount: function(){
		//Mount submit function to html element after rendering
		var url = this.props.action;
		var mode = this.props.mode;
		var updateIndex = this.props.index;
		jQuery('#f-add-experience').submit(function(){
			var company = $('#f-add-experience .excompany').val();
			var title = $('#f-add-experience .extitle').val();
			var description = $('#f-add-experience .exdesc').val();
			var year = $('#f-add-experience .exyear').val();

			//Initial values tranfered
			var data = {};
			if (mode == 'new') {
				data = {company:company, title:title, description:description, year:year, dir:'data', file:'experience.json'};
			} else {
				data = {company:company, title:title, description:description, year:year, dir:'data', file:'experience.json', index:updateIndex};
			}

			$.ajax({
				url: url,
				type: "post",
				data: data,
				success: function(data){
					if (data.charAt(0) != '-') {
						this.refreshParentView(JSON.parse(data));
					}
				}.bind(this),
				error: function(xhr, status, err){
					console.error(url, status, err.toString());
				}.bind(this)
			});

			return false;
		}.bind(this));
	},
	refreshParentView: function(data){
		this.props.onRefresh(data);
		closeProduct();
	},
	render: function(){
		return(
			<div class="row">
				<div class="col-xs-12">
					<form id="f-add-experience" method="post">
						<p>Add/Modify your experience:</p>
						<p>Company:</p>
						<input className="excompany" type="Text" placeholder="Text" defaultValue={this.props.company}></input><p></p>

						<p>Title:</p>
						<input className="extitle" type="text" placeholder="Text" defaultValue={this.props.title}/><p></p>

						<p>Description:</p>
						<textarea className="exdesc" placeholder="Text" defaultValue={this.props.description}></textarea><p></p>

						<p>Year:</p>
						<input className="exyear m-b-10px" type="text" placeholder="YYYY" defaultValue={this.props.year}/><p></p>

						<button className="btn btn-success">Update</button>
					</form>
				</div>
			</div>
		);
	}
});

//Main
var actionRemove = getSiteUrl() + "controller/SiteController.php?action=removeexperience";
var actionUpdate = getSiteUrl() + "controller/SiteController.php?action=updateexperience";
React.render(
    <ExperienceBox url="data/experience.json"
					actionRemove={actionRemove}
					actionUpdate={actionUpdate}
	/>,document.getElementById('experiences')
);
