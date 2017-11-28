import { connect } from 'react-redux';
import Control from '../components/Control';

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => { // eslint-disable-line no-unused-vars
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Control);
