export function evalCondition(condition: string, vars: Record<string, any>): boolean {
    if (!condition || condition.trim() === '') return false;
    const trimmed = condition.trim();
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    const safe = trimmed.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, (name) => {
      if (['true', 'false', 'null', 'undefined'].includes(name)) return name;
      if (Object.prototype.hasOwnProperty.call(vars, name)) return JSON.stringify(vars[name]);
      return 'undefined';
    });
    try {
      const fn = new Function(`return (${safe});`);
      return Boolean(fn());
    } catch (e) {
      return false;
    }
  }