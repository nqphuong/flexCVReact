var HobbyTitle = React.createClass({
	componentDidMount: function(){
		jQuery("#modif_hob").bind("click", function(e){
			e.preventDefault();
			reactClickEvent("hobbies", "modif_hob");
			
			actionRemove = getSiteUrl() + "controller/SiteController.php?action=removehobby"
			actionMove = getSiteUrl() + "controller/SiteController.php?action=moveitemhobby"
			actionAddNew = getSiteUrl() + "controller/SiteController.php?action=addnewhobby"

			React.render(
				<AddHobbyPanelContent url="data/hobby.json"
								actionRemove={actionRemove}
								actionMove={actionMove}
								actionAddNew={actionAddNew}
								onRefresh={this.refreshBlock}
				/>, document.getElementById('modifyPanel-content')
			);
		}.bind(this));
	},
	refreshBlock: function(data){
		this.props.onRefresh(data)
	},
	render: function(){
		return (
			<div className="title">
                <div className="overlay">
                    <a id="modif_hob" href="html/calljson.php">
                        <span className="fa fa-pencil fa-2x"></span>
                    </a>
                </div>
                <h2>// {this.props.title}</h2>
            </div>
		);
	}
});

var HobbyItem = React.createClass({
	render: function(){
		return (
			<div className="hobby">{this.props.item}</div>
		);
	}
});

var HobbyList = React.createClass({
	render: function(){
		var hobbyList = this.props.data.map(function(detail){
			return(
				<HobbyItem item={detail.item} />
			);
		});
		return (
			<div>
				{hobbyList}
			</div>
		);
	}
});

var Hobby = React.createClass({
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
	
	componentDidMount: function(){
		this.loadDataFromServer();
	},
	
	getInitialState: function(){
		return {
			data:[],
		}
	},
	
	refreshBlockView: function(data){
		this.setState({data:data});
	},
	
    render: function(){
        return (
			<div>
				<HobbyTitle title="Hobbies"
							onRefresh={this.refreshBlockView}/>
				<HobbyList data={this.state.data}/>
			</div>
        );
    }
});

/*Add/Modify panel content
 **/
var ItemHobbyPanel = React.createClass({
	
	removeHandler: function(index){
		//Cannot remove child by the code below with javascript traditionnal because the li element keeps it index when rendering
		//and it will not be updated with javascript function! Omg!
		//var list = document.getElementById('skill_lists');
		//list.removeChild(list.childNodes[index]);
		$.ajax({
			url:this.props.actionRemove,
			type: 'post',
			data:{index:index, dir:'data', file:'hobby.json'},
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
			data:{index:index, move:'up', dir:'data', file:'hobby.json'},
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
	
	itemDown: function(index){
		$.ajax({
			url:this.props.actionMove,
			type:'post',
			data:{index:index, move:'down', dir:'data', file:'hobby.json'},
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
				<div>{this.props.item}</div>
				<a onClick={this.itemUp.bind(this, this.props.index)}><span className="fa fa-arrow-circle-up fa-2x"></span></a>
                <a onClick={this.itemDown.bind(this, this.props.index)}><span className="fa fa-arrow-circle-down fa-2x"></span></a>
				<a onClick={this.removeHandler.bind(this, this.props.index)}><span className="fa fa-remove fa-2x"></span></a>
			</li>
		);
	}
});

var ItemHobbyListPanel = React.createClass({
	refreshView: function(data){
		this.props.onRefresh(data);
	},
	render: function(){
		var itemList = this.props.data.map(function(detail, index){
			return(
				<ItemHobbyPanel item={detail.item}
								index={index}
								actionRemove={this.props.actionRemove}
								actionMove={this.props.actionMove}
								onRefresh={this.refreshView}/>
			);
		}, this);
		
		return(
			<ul id="hobby_lists">
				{itemList}
			</ul>
		);
	}
});

var AddHobbyPanelContent = React.createClass({
	refreshView: function(data){
		this.setState({data:data});
		
		//Refresh parent view (Block Hobbies)
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
	},
	
	getInitialState: function(){
		return{
			data:[],
		};
	},
	
	addNewItem: function(){
		var name = $('#f-add-hobby .left').val();
		$.ajax({
			url:this.props.actionAddNew,
			type:'post',
			data:{name:name, dir:'data', file:'hobby.json'},
			success: function(data){
				if (data.charAt(0) != '-') {
					this.refreshView(JSON.parse(data));
					$('#f-add-hobby .left').val("");
				} else {
					alert('nothing to do!');
				}
				
			}.bind(this),
			error: function(xhr, status, err){
				console.error('Err: Add new item hobby', status, err.toString());
			}.bind(this)
		});
	},
	
	render: function(){
		return (
			<div class="col-xs-12">
				<div id="f-add-hobby">
					<p>Add/Modify your hobbies:</p>
					
					<div className="title">
						<div className="first">Hobbies</div>
						<div>Level</div>
					</div>
					
					<ItemHobbyListPanel data={this.state.data}
										actionRemove={this.props.actionRemove}
										actionMove={this.props.actionMove}
										onRefresh={this.refreshView}/>
					
					<div className="title">
						<input className="left" placeholder="Hobby"/>
						<a onClick={this.addNewItem}><span className="fa fa-plus fa-2x"></span></a>
					</div>
					<p className="remark">(*) Level is between 0 and 1.</p>
				</div>
			</div>
		);
	}
});

/*Main
 **/
React.render(
    <Hobby url="data/hobby.json"/>, document.getElementById('hobbies')
);

