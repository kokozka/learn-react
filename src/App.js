import { useState } from 'react';
import 'antd/dist/antd.dark.css';
import { Button } from 'antd';
import RecipeTable from './components/RecipeTable.js';

/* TODO:
  - finish server side filter/sort
  - use react.lazy for RecipeTable loading
  - create mock with corrupted data and XSS
  - add error boundary
  - upgrade to typescript
 */
function App() {
  const tblRecipes = [
    ['Salaries', {colDefId: 1, dataApiPath: 'tableData'}],
    ['Colleagues', {colDefId: 2, dataApiPath: 'tableData'}],
    ['Empty/Non-existing', {}]
  ];
  const [tblRecipe, setTblRecipe] = useState();

  return (
    <div className="App">
      {tblRecipes.map((recipe, key) => <Button key={key} onClick={e => setTblRecipe(recipe[1])}>{recipe[0]}</Button>)}
      <RecipeTable recipe={tblRecipe} />
    </div>
  );
}

export default App;
