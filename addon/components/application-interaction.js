import Interaction from 'explorviz-frontend/utils/application-rendering/interaction'
import { inject as service } from "@ember/service";

export default Interaction.extend({
  landscapeService: service()
});
