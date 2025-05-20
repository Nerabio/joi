import 'reflect-metadata';


function controllerDecorator(path: string): ClassDecorator {
    return (ctor: Function) => {
        Reflect.defineMetadata('prefix', path, ctor);
    }

}
export default controllerDecorator;