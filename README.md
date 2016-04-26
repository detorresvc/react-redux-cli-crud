# REACT REDUX CLI FILE STRUCTURE

## How to start

Installation:  
```
npm install -g react-redux-cli-file-structure

if permission denied 

sudo npm install -g react-redux-cli-file-structure
```

Usage:  
```
On you command line type without $

$v -d ~/directory_destination/ ModueNameShouldStudly

OR 

$v --dirdest ~/directory_destination/ ModueNameShouldStudly
```

Result:
```
directory_destination
	-moduenameshouldstudly
		-actions
			->index.js
		-components
		-containers
			->ModueNameShouldStudly.js
		-reducers
			->index.js
		->routes.js
		->constants.js

```

ModueNameShouldStudly.js:
```
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';

class ModueNameShouldStudly extends Component {

    state = {}

    render(){

                return (
                        <div></div>
                )
        }
}

export default connect(
        state => {
                const moduenameshouldstudly = state.moduenameshouldstudly

                return {
            moduenameshouldstudly
                }
        },
        dispatch => {
                return {
                        action: bindActionCreators(actions,  dispatch)
                }
        }
)(ModueNameShouldStudly)
```

reducers.js
```
import * as c from './constants';

const initState = {}

export const moduenameshouldstudly = (state = initState, action) => {
        return state;
}
```
