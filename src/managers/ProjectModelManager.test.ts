import { loadJson } from "test/utility";
import { ProjectModelManager } from "./ProjectModelManager";

const projectFile = loadJson('./src/test/resources/ProjectModelManager.test/test.docp');
const projectFile201 = loadJson('./src/test/resources/ProjectModelManager.test/test_project_v2.0.1.docp');
const projectFile202 = loadJson('./src/test/resources/ProjectModelManager.test/test_project_v2.0.2.docp');

it('project model version up 1.0.4 to 2.0.3 lastest', () => {
  const model = ProjectModelManager.Up(projectFile);

  expect(model.projectModelVersion).toBe('2.0.3');
})

it('project model version up 2.0.1 to 2.0.3 lastest', () => {
  const model = ProjectModelManager.Up(projectFile201);

  expect(model.projectModelVersion).toBe('2.0.3');
})

it('project model version up 2.0.2 to 2.0.3 lastest', () => {
  const model = ProjectModelManager.Up(projectFile202);

  expect(model.projectModelVersion).toBe('2.0.3');
})