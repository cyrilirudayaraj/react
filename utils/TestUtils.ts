//TODO exclude this file during bundling
export function findByName(wrapper: any, name: string): any {
  const selector = "input[name='" + name + "']";
  return wrapper.find(selector).last();
}

export function findById(wrapper: any, id: string): any {
  const selector = '#' + id;
  return wrapper.find(selector).last();
}

export function changeValueById(wrapper: any, id: string, value: string): void {
  findById(wrapper, id).simulate('change', {
    target: { name: id, value: value },
  });
}

export function sleep(x: number): Promise<any> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, x);
  });
}
