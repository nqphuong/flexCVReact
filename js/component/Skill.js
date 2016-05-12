var SkillTitle = React.createClass({
	componentDidMount: function(){
		jQuery("#modif_skills").bind("click", function(e){
			e.preventDefault();
			reactClickEvent("skills", "modif_skills");

			actionRemove = getSiteUrl() + "controller/SiteController.php?action=removeskill"
			actionMove = getSiteUrl() + "controller/SiteController.php?action=moveitemskill"
			actionAddNew = getSiteUrl() + "controller/SiteController.php?action=addnewskill"
			actionSaveAll = getSiteUrl() + "controller/SiteController.php?action=updateskills"
			React.render(
				<AddSkillPanelContent url="data/skill.json"
							actionRemove={actionRemove}
							actionMove={actionMove}
							actionAddNew={actionAddNew}
							actionSaveAll={actionSaveAll}
							onRefresh={this.refreshBlock}
				/>,document.getElementById('modifyPanel-content')
			);
		}.bind(this));
	},
	refreshBlock: function(data){
		this.props.onRefresh(data);
	},
	render: function(){
		return(
			<div className="title">
				{
					allowModif() ?
					<div className="overlay">
	                    <a id="modif_skills" href="calljson.php">
	                        <span className="fa fa-pencil fa-2x"></span>
	                    </a>
	                </div> : ''
				}
                <h2>// {this.props.title}</h2>
            </div>
		);
	}
});

var SkillBottom = React.createClass({
	render: function(){
		return(
			<div className="skills-legend clearfix">
                <div className="legend">Beginner</div>
                <div className="legend">Proficient</div>
                <div className="legend">Expert</div>
                <div className="legend last">Master</div>
            </div>
		);
	}
});

var SkillItem = React.createClass({
	render: function(){
		return (
			<div className="item-skills w-100" data-percent={this.props.percent}>{this.props.name}</div>
		);
	}
});

var SkillList = React.createClass({
	render: function(){
		var skillList = this.props.data.map(function(detail){
			return(
				<SkillItem percent={detail.percent}
							name={detail.name}/>
			);
		});
		return(
			<div className="skills">
                {skillList}
            </div>
		);
	}
});

var SkillBox = React.createClass({

	loadDataFromServer: function(){
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			success: function(data){
				this.setState({data:data});
			}.bind(this),
			error: function(xhr, status, err){
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},

	getInitialState: function(){
		return{
			data:[],
		}
	},

	componentDidMount: function(){
		this.loadDataFromServer();
	},

	componentWillMount: function(){},

	//Run js after painting element
	componentDidUpdate: function(){
		$('.item-skills').each(function(){
			newWidth = $(this).parent().width() * $(this).data('percent');
			$(this).width(0);
			$(this).animate({
				width: newWidth,
			}, 1000);
		});
	},

	refreshBlockView: function(data){
		this.setState({data:data});
	},

	render: function(){
        return(
			<div>
				<SkillTitle title="Skills"
							onRefresh={this.refreshBlockView}/>
				<SkillList data={this.state.data}/>
				<SkillBottom />
			</div>
        );
    }
});

/*Add/Modify panel content
 **/
ItemSkillPanel = React.createClass({

	removeHandler: function(index){
		//Cannot remove child by the code below with javascript traditionnal because the li element keeps it index when rendering
		//and it will not be updated with javascript function! Omg!
		//var list = document.getElementById('skill_lists');
		//list.removeChild(list.childNodes[index]);

		$.ajax({
			url:this.props.actionRemove,
			type: 'post',
			data:{index:index, dir:'data', file:'skill.json'},
			success: function(data){
				if (data.charAt(0) != '-') {
					this.refreshView(JSON.parse(data));
				}
			}.bind(this),
			error: function(xhr, status, err){
				console.error('Err: Remove skill item', status, err.toString());
			}.bind(this)
		});
	},

	itemUp: function(index){
		$.ajax({
			url:this.props.actionMove,
			type:'post',
			data:{index:index, move:'up', dir:'data', file:'skill.json'},
			success: function(data){
				if (data.charAt(0) != '-') {
					this.refreshView(JSON.parse(data));
				}
			}.bind(this),
			error: function(xhr, status, err){
				console.error('Err: Move item down', status, err.toString());
			}.bind(this)
		});
	},

	onChangeHandler: function(){
		//Todo
		return false;
	},

	itemDown: function(index){
		$.ajax({
			url:this.props.actionMove,
			type:'post',
			data:{index:index, move:'down', dir:'data', file:'skill.json'},
			success: function(data){
				if (data.charAt(0) != '-') {
					this.refreshView(JSON.parse(data));
				}
			}.bind(this),
			error: function(xhr, status, err){
				console.error('Err: Move item down', status, err.toString());
			}.bind(this)
		});
	},

	refreshView: function(data){
		this.props.onRefresh(data);
	},

	render: function(){
		return(
			<li className="first">
				<div>{this.props.name}</div>
				<input value={this.props.percent} onChange="javascript:void(0);"/>
				<a onClick={this.itemUp.bind(this, this.props.index)}><span className="fa fa-arrow-circle-up fa-2x"></span></a>
                <a onClick={this.itemDown.bind(this, this.props.index)}><span className="fa fa-arrow-circle-down fa-2x"></span></a>
				<a onClick={this.removeHandler.bind(this, this.props.index)}><span className="fa fa-remove fa-2x"></span></a>
			</li>
		);
	}
});

ItemSkillListPanel = React.createClass({
	refreshView: function(data){
		this.props.onRefresh(data);
	},
	render: function(){
		var itemList = this.props.data.map(function(detail, index){
			return(
				<ItemSkillPanel percent={detail.percent}
								name={detail.name}
								index={index}
								actionRemove={this.props.actionRemove}
								actionMove={this.props.actionMove}
								onRefresh={this.refreshView}/>
			);
		}, this);

		return(
			<ul id="skill_lists">
				{itemList}
			</ul>
		);
	}
});

AddSkillPanelContent = React.createClass({
	refreshView: function(data){
		this.setState({data:data});

		//Refresh parent view (Block Skills)
		this.props.onRefresh(data);
	},

	loadDataFromServer: function(){
		$.ajax({
			url: this.props.url,
			dataType:'json',
			success: function(data){
				this.setState({data:data});
			}.bind(this),
			error: function(xhr, status, err){
				console.error('Err: Load skills to panel content', status, err.toString());
			}.bind(this)
		});
	},

	componentDidMount: function(){
		//Load data at first time
		this.loadDataFromServer();

		//Submit data content
		jQuery('#f-add-skill .btn-success').bind('click', function(e){
			e.preventDefault();

			//Get all element in list
			var skills = [];
			$('#skill_lists').each(function(){
				$(this).find('li').each(function(){
					var current = $(this);
					if (current.children().size() > 0) {
						var item = {'percent':current.children('input').val(), 'name':current.children('div').text()};
						skills.push(item);
					}
				});
			});

			var url = this.props.actionSaveAll;
			$.ajax({
				url:url,
				type:'post',
				data:{content:JSON.stringify(skills), dir:'data', file:'skill.json'},
				success: function(data){
					if (data.charAt(0) != '-') {
						this.refreshView(JSON.parse(data));
						//Close panel
						closeProduct();
					}
				}.bind(this),
				error: function(xhr, status, err){
					console.error('Err: Update skills', status, err.toString());
				}.bind(this)
			});
		}.bind(this));
	},

	getInitialState: function(){
		return{
			data:[],
		};
	},

	addNewItem: function(){
		var name = $('#f-add-skill .left').val();
		var percent = $('#f-add-skill .right').val();
		$.ajax({
			url:this.props.actionAddNew,
			type:'post',
			data:{name:name, percent:percent, dir:'data', file:'skill.json'},
			success: function(data){
				if (data.charAt(0) != '-') {
					this.refreshView(JSON.parse(data));
					$('#f-add-skill .left').val("");
					$('#f-add-skill .right').val("");
				}
			}.bind(this),
			error: function(xhr, status, err){
				console.error('Err: Add new item skill', status, err.toString());
			}.bind(this)
		});
	},

	render: function(){
		return (
			<div class="col-xs-12">
				<div id="f-add-skill">
					<p>Add/Modify your skills:</p>

					<div className="title">
						<div className="first">Skill</div>
						<div>Level</div>
					</div>

					<ItemSkillListPanel data={this.state.data}
										actionRemove={this.props.actionRemove}
										actionMove={this.props.actionMove}
										onRefresh={this.refreshView}/>

					<div className="title">
						<input className="left" placeholder="Skill"/>
						<input className="right" placeholder="0" />
						<a onClick={this.addNewItem}><span className="fa fa-plus fa-2x"></span></a>
					</div>
					<p className="remark">(*) Level is between 0 and 1.</p>
					<button className="btn btn-success">Update</button>
				</div>
			</div>
		);
	}
});


/*Main
 **/
React.render(
    <SkillBox url="data/skill.json"
				/>, document.getElementById('skills')
);
