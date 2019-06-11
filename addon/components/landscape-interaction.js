import Interaction from 'explorviz-frontend/utils/landscape-rendering/interaction'
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Interaction.extend(AlertifyHandler,{
  landscapeService: service()
});
