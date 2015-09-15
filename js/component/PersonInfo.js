var PersonInfo = React.createClass({
    render: function(){
        return(
            <div className="text-center">
                <div className="avatar">
                    <img src="images/myavatar.jpg"/>
                </div>
                <div className="text-header">
                    <h1>
                        <strong>HELLO,</strong><br />
                        <span>MY NAME IS </span><span className="name">RICHARD NGUYEN</span><span> AND THIS IS MY RESUME/CV</span>
                    </h1>
                </div>
            </div>
        );
    }
});

React.render(
    <PersonInfo />, document.getElementById('personInfo')
);