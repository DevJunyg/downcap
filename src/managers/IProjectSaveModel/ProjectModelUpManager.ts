abstract class ProjectModelUpManager<UpVersion, DownVersion> {
  public abstract Up(model: DownVersion): UpVersion
}

export default ProjectModelUpManager;