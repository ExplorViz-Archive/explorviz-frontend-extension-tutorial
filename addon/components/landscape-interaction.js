import Interaction from 'explorviz-frontend/utils/landscape-rendering/interaction'
import { inject as service } from "@ember/service";

export default Interaction.extend({
  landscapeService: service()
});
