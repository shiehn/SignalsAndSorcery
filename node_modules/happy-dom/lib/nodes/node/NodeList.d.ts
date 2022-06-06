import INodeList from './INodeList';
import INode from './INode';
/**
 * Class list.
 */
export default class NodeList extends Array implements INodeList<INode> {
    /**
     * Returns item by index.
     *
     * @param index Index.
     */
    item(index: number): INode;
}
