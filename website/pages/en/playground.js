const React = require("react");
const CompLibrary = require("../../core/CompLibrary.js");
const Container = CompLibrary.Container;

class PlayGround extends React.Component {
  render() {
    return (
      <div className="mainContainer playground_container">
        <Container>
          <header>
            <h1>PlayGround</h1>
          </header>
          <div id="playground"></div>
          <script src="js/playground/playground.js"></script>
        </Container>
      </div>
    );
  }
}

PlayGround.title = "Play Ground";
module.exports = PlayGround;
