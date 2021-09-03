let screencontext = Symbol('screencontext');

export function screencontexts(context) {
    if (context) {
        let ppctx = unwrap(context.$parentContext, '$parentContext');
        if (ppctx && !defined(ppctx.$parentContext)) {
            return [context].concat(context.$parentContext[screencontext]);
        } else {
            return screencontexts(context.$parentContext);
        }
    }
    return [];
}

ko.bindingHandlers.screen = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        let screen = ko.unwrap(valueAccessor());
        $(element).addClass("screen "+ screen.constructor.name);
        console.log(screen.constructor.name + ' opened.');
        // Since the template binding cannot bind with an html string directly, we need to first create a template for
        // it to bind with. The template must also be cleaned up when the screen closes.
        // $('head').append($('<script type="text/html">' + screen.html() + '</script>').attr('id', 'lllscreen'));
        let template = 'template_' + screen.constructor.name;
        // let screenctx = screencontexts(bindingContext);
        // Remove all parent contexts except the root context. This is primarily to prevent subscreens from accessing
        // their containing screens, because screens should be completely self-contained. If a subscreen is required to
        // react to something on the parent screen, give it an observable in the settings.
        while (bindingContext.$parentContext) {
            bindingContext = bindingContext.$parentContext; // Will eventually reset to $root.
        }
        let childBindingContext = bindingContext.createChildContext(
            bindingContext.$rawData,
            null,
            context => Object.assign(context, { $data: screen, $screen: screen })
        );
        let bindings = {
            template: {
                name: template,
                data: ko.unwrap(screen),
                as: '$screen'
            }
        };
        // Two levels are added to the binding context: the screen, and then the model.
        ko.applyBindingsToNode(element, bindings);
        return { controlsDescendantBindings: true };
    },
};

