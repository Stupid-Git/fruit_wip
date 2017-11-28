import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import Fruit from '../components/Fruit';
import userActions from '../actions/user';

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  const user = bindActionCreators(userActions, dispatch);
  return {
    onFruit: (data) => {
      user.fruit(data);
      dispatch(push('/loggedin'));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Fruit);
